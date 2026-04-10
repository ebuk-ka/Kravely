
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

// ===== GET ALL VENDORS =====
export function useVendors(category = null) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVendors = async () => {
      setLoading(true);
      let query = supabase
        .from("vendors")
        .select("*")
        .eq("is_active", true)
        .eq("is_approved", true)
        .order("is_featured", { ascending: false })
        .order("rating", { ascending: false });

      if (category && category !== "all") {
        query = query.eq("category", category);
      }

      const { data, error } = await query;
      if (error) setError(error.message);
      else setVendors(data || []);
      setLoading(false);
    };

    fetchVendors();
  }, [category]);

  return { vendors, loading, error };
}

// ===== GET SINGLE VENDOR =====
export function useVendor(vendorId) {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!vendorId) return;
    const fetchVendor = async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("id", vendorId)
        .single();
      if (error) setError(error.message);
      else setVendor(data);
      setLoading(false);
    };
    fetchVendor();
  }, [vendorId]);

  return { vendor, loading, error };
}

// ===== GET MENU ITEMS FOR A VENDOR =====
export function useMenuItems(vendorId) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!vendorId) return;
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("vendor_id", vendorId)
        .eq("is_available", true)
        .order("is_sponsored", { ascending: false })
        .order("total_orders", { ascending: false });

      if (error) setError(error.message);
      else setItems(data || []);
      setLoading(false);
    };
    fetchItems();
  }, [vendorId]);

  return { items, loading, error };
}

// ===== GET POPULAR MEALS (across all vendors) =====
export function usePopularMeals(limit = 10) {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*, vendors(name, is_open)")
        .eq("is_available", true)
        .order("is_sponsored", { ascending: false })
        .order("total_orders", { ascending: false })
        .limit(limit);

      if (!error) setMeals(data || []);
      setLoading(false);
    };
    fetchMeals();
  }, [limit]);

  return { meals, loading };
}

// ===== VENDOR DASHBOARD — get own vendor data =====
export function useVendorDashboard(userId) {
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchVendor = async () => {
      const { data, error } = await supabase
        .from("vendors")
        .select("*")
        .eq("owner_id", userId)
        .single();
      if (!error) setVendor(data);
      setLoading(false);
    };
    fetchVendor();
  }, [userId]);

  // Toggle menu item availability
  const toggleMenuItem = async (itemId, isAvailable) => {
    const { error } = await supabase
      .from("menu_items")
      .update({ is_available: isAvailable, updated_at: new Date().toISOString() })
      .eq("id", itemId);
    if (error) throw error;
  };

  // Add new menu item
  const addMenuItem = async (item) => {
    if (!vendor) return;
    const { data, error } = await supabase
      .from("menu_items")
      .insert({ ...item, vendor_id: vendor.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  // Delete menu item
  const deleteMenuItem = async (itemId) => {
    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", itemId);
    if (error) throw error;
  };

  // Update vendor profile
  const updateVendorProfile = async (updates) => {
    if (!vendor) return;
    const { data, error } = await supabase
      .from("vendors")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", vendor.id)
      .select()
      .single();
    if (error) throw error;
    setVendor(data);
    return data;
  };

  return { vendor, loading, toggleMenuItem, addMenuItem, deleteMenuItem, updateVendorProfile };
}

// ===== DELIVERY LOCATIONS =====
export function useDeliveryLocations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      const { data } = await supabase
        .from("delivery_locations")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      setLocations(data || []);
      setLoading(false);
    };
    fetchLocations();
  }, []);

  return { locations, loading };
}
