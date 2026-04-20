

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

// ===== PLACE AN ORDER =====
export function usePlaceOrder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const placeOrder = async ({ studentId, vendorId, cartItems, deliveryLocation, deliveryZone, deliveryNotes }) => {
    setLoading(true);
    setError(null);

    try {
      // Calculate subtotal in kobo
      const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const deliveryFee = 30000; // ₦300 in kobo
      const totalAmount = subtotal + deliveryFee;

      // 1. Create the order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          student_id: studentId,
          vendor_id: vendorId,
          delivery_location: deliveryLocation,
          delivery_zone: deliveryZone,
          delivery_notes: deliveryNotes,
          subtotal,
          delivery_fee: deliveryFee,
          total_amount: totalAmount,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert all order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.qty,
        emoji: item.emoji || "🍽️",
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Create payment record
      const { error: paymentError } = await supabase
        .from("payments")
        .insert({
          order_id: order.id,
          student_id: studentId,
          amount: totalAmount,
          status: "pending",
        });

      if (paymentError) throw paymentError;

      setLoading(false);
      return order;

    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { placeOrder, loading, error };
}

// ===== STUDENT — get own orders =====
export function useStudentOrders(studentId) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) return;

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          vendors(name, phone, logo_url),
          order_items(*)
        `)
        .eq("student_id", studentId)
        .order("placed_at", { ascending: false });

      if (error) setError(error.message);
      else setOrders(data || []);
      setLoading(false);
    };

    fetchOrders();

    //  REALTIME — listen to student's own order updates
    const channel = supabase
      .channel(`student-orders-${studentId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `student_id=eq.${studentId}`,
        },
        (payload) => {
          setOrders(prev =>
            prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } : o)
          );
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [studentId]);

  return { orders, loading, error };
}

// ===== VENDOR — get incoming orders with realtime =====
export function useVendorOrders(vendorId) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!vendorId) return;

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          profiles(full_name, phone),
          order_items(*)
        `)
        .eq("vendor_id", vendorId)
        .order("placed_at", { ascending: false });

      if (error) setError(error.message);
      else setOrders(data || []);
      setLoading(false);
    };

    fetchOrders();

    // 🔴 REALTIME — vendor sees new orders instantly
    const channel = supabase
      .channel(`vendor-orders-${vendorId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
          filter: `vendor_id=eq.${vendorId}`,
        },
        async (payload) => {
          // Fetch full order with items and student info
          const { data } = await supabase
            .from("orders")
            .select(`*, profiles(full_name, phone), order_items(*)`)
            .eq("id", payload.new.id)
            .single();

          if (data) setOrders(prev => [data, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `vendor_id=eq.${vendorId}`,
        },
        (payload) => {
          setOrders(prev =>
            prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } : o)
          );
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [vendorId]);

  // Update order status (pending → preparing → ready → delivered)
  const updateOrderStatus = async (orderId, newStatus) => {
    const timestamps = {
      preparing: { confirmed_at: new Date().toISOString() },
      ready:     { prepared_at: new Date().toISOString() },
      delivered: { delivered_at: new Date().toISOString() },
      cancelled: { cancelled_at: new Date().toISOString() },
    };

    const { error } = await supabase
      .from("orders")
      .update({
        status: newStatus,
        ...timestamps[newStatus],
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (error) throw error;
  };

  return { orders, loading, error, updateOrderStatus };
}

// ===== SUBMIT A REVIEW =====
export function useReview() {
  const [loading, setLoading] = useState(false);

  const submitReview = async ({ orderId, studentId, vendorId, rating, comment }) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("reviews")
      .insert({ order_id: orderId, student_id: studentId, vendor_id: vendorId, rating, comment })
      .select()
      .single();
    setLoading(false);
    if (error) throw error;
    return data;
  };

  return { submitReview, loading };
}

// ===== ADMIN — all orders + stats =====
export function useAdminOrders() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [ordersRes, statsRes] = await Promise.all([
        supabase
          .from("order_details")
          .select("*")
          .order("placed_at", { ascending: false })
          .limit(100),
        supabase.from("revenue_summary").select("*").single(),
      ]);

      if (!ordersRes.error) setOrders(ordersRes.data || []);
      if (!statsRes.error) setStats(statsRes.data);
      setLoading(false);
    };

    fetchAll();

    // Realtime for admin — any new order
    const channel = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" },
        () => fetchAll()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  return { orders, stats, loading };
}
