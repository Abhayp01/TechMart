"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X, AlertCircle, RefreshCw, Download, Upload } from "lucide-react";
import Link from "next/link";

interface ProductType {
  _id: string;
  name: string;
  slug: string;
  sku: string;
  brand: string;
  brandSlug: string;
  category: string;
  subcategory: string;
  description: string;
  price: number;
  mrp: number;
  stock: number;
  tags?: string[];
  images?: string[];
  highlights?: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authError, setAuthError] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductType | null>(null);

  // Form State
  const [formName, setFormName] = useState("");
  const [formSku, setFormSku] = useState("");
  const [formBrand, setFormBrand] = useState("");
  const [formCategory, setFormCategory] = useState("laptops");
  const [formSubcategory, setFormSubcategory] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState(0);
  const [formMrp, setFormMrp] = useState(0);
  const [formStock, setFormStock] = useState(0);
  const [formTags, setFormTags] = useState("");
  const [formImages, setFormImages] = useState("");
  const [formHighlights, setFormHighlights] = useState("");

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const csvHeaders = ["Product Name", "SKU Identifier", "Brand", "Category", "Subcategory", "Stock Level", "Price (INR)", "MRP (INR)", "Description", "Images URLs", "Highlights / Specifications", "Tags"];

  const escapeCsv = (value: unknown) => {
    const text = String(value ?? "");
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  const handleExportCsv = () => {
    const rows = products.map((product) => [
      product.name, product.sku, product.brand, product.category, product.subcategory,
      product.stock, product.price, product.mrp, product.description,
      product.images?.join(", "), product.highlights?.join(", "), product.tags?.join(", "),
    ]);
    const csv = [csvHeaders, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `products-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const parseCsv = (text: string, delimiter = ","): string[][] => {
    const rows: string[][] = [];
    let row: string[] = [];
    let field = "";
    let quoted = false;
    for (let i = 0; i < text.length; i += 1) {
      const char = text[i];
      if (char === '"') {
        if (quoted && text[i + 1] === '"') { field += '"'; i += 1; }
        else quoted = !quoted;
      } else if (char === delimiter && !quoted) { row.push(field.trim()); field = ""; }
      else if ((char === "\n" || char === "\r") && !quoted) {
        if (char === "\r" && text[i + 1] === "\n") i += 1;
        row.push(field.trim());
        if (row.some(Boolean)) rows.push(row);
        row = []; field = "";
      } else field += char;
    }
    row.push(field.trim());
    if (row.some(Boolean)) rows.push(row);
    return rows;
  };

  const handleImportCsv = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const fileText = await file.text();
      const delimiter = file.name.toLowerCase().endsWith(".tsv") || fileText.split(/\r?\n/, 1)[0].includes("\t") ? "\t" : ",";
      const rows = parseCsv(fileText, delimiter);
      if (rows.length < 2) throw new Error("CSV must contain a header row and at least one product row.");
      const header = rows[0].map((value) => value.replace(/^\uFEFF/, "").trim().toLowerCase());
      const indexOf = (name: string) => header.indexOf(name.toLowerCase());
      const required = ["Product Name", "SKU Identifier", "Brand", "Category", "Subcategory", "Stock Level", "Price (INR)", "MRP (INR)", "Description"];
      const missing = required.filter((name) => indexOf(name) < 0);
      if (missing.length) throw new Error(`Missing CSV columns: ${missing.join(", ")}`);

      const value = (row: string[], name: string) => row[indexOf(name)]?.trim() || "";
      const list = (row: string[], name: string) => value(row, name).split(",").map((item) => item.trim()).filter(Boolean);
      const failures: string[] = [];
      let imported = 0;
      for (let rowNumber = 1; rowNumber < rows.length; rowNumber += 1) {
        const row = rows[rowNumber];
        const name = value(row, "Product Name");
        const sku = value(row, "SKU Identifier");
        const brand = value(row, "Brand");
        const price = Number(value(row, "Price (INR)"));
        const mrp = Number(value(row, "MRP (INR)"));
        const stock = Number(value(row, "Stock Level"));
        if (!name || !sku || !brand || !Number.isFinite(price) || !Number.isFinite(mrp) || !Number.isFinite(stock)) {
          failures.push(`Row ${rowNumber + 1}: missing or invalid required values`);
          continue;
        }
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
        const payload = {
          name, slug, sku, brand, brandSlug: brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""),
          category: value(row, "Category").toLowerCase(), subcategory: value(row, "Subcategory"),
          description: value(row, "Description"), stock, price, mrp,
          discount: mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0,
          images: list(row, "Images URLs"), highlights: list(row, "Highlights / Specifications"), tags: list(row, "Tags"),
        };
        const response = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        const data = await response.json();
        if (data.success) { imported += 1; } else failures.push(`Row ${rowNumber + 1} (${sku}): ${data.message || "Import failed"}`);
      }
      await fetchProducts();
      setError(`${imported} product${imported === 1 ? "" : "s"} imported${failures.length ? `. ${failures.length} row${failures.length === 1 ? "" : "s"} failed: ${failures.join("; ")}` : "."}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not import CSV file.");
    } finally { setLoading(false); }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/products", { cache: "no-store" });
      const data = await res.json();
      if (res.status === 401 || res.status === 403) {
        setAuthError(true);
        return;
      }
      if (data.success) {
        setProducts(data.data);
      } else {
        setError(data.message || "Failed to load products");
      }
    } catch (err) {
      setError("An unexpected error occurred while loading products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName("");
    setFormSku("");
    setFormBrand("");
    setFormCategory("laptops");
    setFormSubcategory("");
    setFormDescription("");
    setFormPrice(0);
    setFormMrp(0);
    setFormStock(0);
    setFormTags("");
    setFormImages("");
    setFormHighlights("");
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (product: ProductType) => {
    setEditingProduct(product);
    setFormName(product.name);
    setFormSku(product.sku);
    setFormBrand(product.brand);
    setFormCategory(product.category);
    setFormSubcategory(product.subcategory);
    setFormDescription(product.description);
    setFormPrice(product.price);
    setFormMrp(product.mrp);
    setFormStock(product.stock);
    setFormTags(product.tags?.join(", ") || "");
    setFormImages(product.images?.join(", ") || "");
    setFormHighlights(product.highlights?.join(", ") || "");
    setFormError("");
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setProducts((currentProducts) => currentProducts.filter((p) => p._id !== id));
      } else {
        alert(data.message || "Failed to delete product");
      }
    } catch (err) {
      alert("Error occurred while deleting product");
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    // Slug generation
    const slug = formName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const brandSlug = formBrand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const priceNum = Number(formPrice);
    const mrpNum = Number(formMrp);
    const discount = mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;

    const payload = {
      name: formName,
      slug,
      sku: formSku,
      brand: formBrand,
      brandSlug,
      category: formCategory,
      subcategory: formSubcategory,
      description: formDescription,
      price: priceNum,
      mrp: mrpNum,
      stock: Number(formStock),
      discount,
      tags: formTags.split(",").map(t => t.trim()).filter(Boolean),
      images: formImages.split(",").map(i => i.trim()).filter(Boolean),
      highlights: formHighlights.split(",").map(h => h.trim()).filter(Boolean),
    };

    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setIsModalOpen(false);
        setProducts((currentProducts) => editingProduct
          ? currentProducts.map((product) => product._id === data.data._id ? data.data : product)
          : [data.data, ...currentProducts]);
      } else {
        setFormError(data.message || "Failed to save product. Please check input values.");
      }
    } catch (err) {
      setFormError("Server error while saving product details.");
    } finally {
      setFormLoading(false);
    }
  };

  if (authError) {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-[#F5F0EB] flex flex-col justify-center items-center p-6">
        <div className="max-w-md text-center bg-[#111] border border-[#222] p-10">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-4 font-heading">ACCESS RESTRICTED</h1>
          <p className="text-[#888] font-mono text-sm mb-6">ADMINISTRATOR PERMISSIONS REQUIRED</p>
          <Link href="/login" className="inline-block bg-[#F5F0EB] text-[#0A0A0F] font-bold px-8 py-3 hover:bg-[#6C63FF] hover:text-[#F5F0EB] transition-colors tracking-wider text-sm font-mono">
            LOG IN AS ADMIN
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-border pb-6 mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Product Inventory</h1>
            <p className="font-medium text-muted-foreground mt-1">Manage all products in B.K. Infotech store</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center gap-2 border border-border bg-card text-foreground font-semibold py-3 px-4 rounded-xl hover:bg-muted transition-colors shadow-sm cursor-pointer">
              <Upload className="w-4 h-4" /> Import CSV
              <input type="file" accept=".csv,text/csv" onChange={handleImportCsv} className="hidden" />
            </label>
            <button
              onClick={handleExportCsv}
              disabled={!products.length}
              className="flex items-center gap-2 border border-border bg-card text-foreground font-semibold py-3 px-4 rounded-xl hover:bg-muted transition-colors shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 bg-primary text-primary-foreground font-semibold py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-5 h-5" /> Add Product
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 mb-6 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 gap-4">
            <RefreshCw className="w-10 h-10 text-primary animate-spin" />
            <p className="text-sm text-muted-foreground font-medium">Retrieving products inventory...</p>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-2xl overflow-x-auto shadow-sm">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="p-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">SKU</th>
                  <th className="p-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Product Name</th>
                  <th className="p-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="p-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Stock</th>
                  <th className="p-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider">Price</th>
                  <th className="p-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-muted-foreground font-medium">
                      No products found. Add your first product to get started.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product._id} className="border-b border-border hover:bg-muted/10 transition-colors">
                      <td className="p-4 font-semibold text-sm text-primary font-mono">{product.sku}</td>
                      <td className="p-4 font-medium text-foreground">{product.name}</td>
                      <td className="p-4 text-sm text-muted-foreground capitalize">{product.category}</td>
                      <td className="p-4">
                        {product.stock > 0 ? (
                          <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-lg">
                            {product.stock} In Stock
                          </span>
                        ) : (
                          <span className="text-xs font-semibold bg-red-100 text-red-700 px-2.5 py-1 rounded-lg">
                            Out of Stock
                          </span>
                        )}
                      </td>
                      <td className="p-4 font-semibold text-foreground">₹{product.price.toLocaleString("en-IN")}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-3">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-border overflow-hidden shadow-2xl flex flex-col my-8 max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-border bg-muted/10">
              <h2 className="text-xl font-bold font-heading text-foreground">
                {editingProduct ? "Edit Product Details" : "Register New Product"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Product Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">SKU Identifier</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all font-mono"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Brand</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Category</label>
                  <select
                    className="w-full bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all cursor-pointer"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                  >
                    <option value="laptops">Laptops</option>
                    <option value="desktops">Desktops</option>
                    <option value="networking">Networking</option>
                    <option value="cctv">CCTV</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Subcategory</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all"
                    value={formSubcategory}
                    onChange={(e) => setFormSubcategory(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Stock Level</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="w-full bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all"
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Price (INR)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="w-full bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">MRP (INR)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="w-full bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all"
                    value={formMrp}
                    onChange={(e) => setFormMrp(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">Description</label>
                <textarea
                  required
                  rows={3}
                  className="w-full bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all resize-none"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Images URLs (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                  className="w-full bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all font-mono"
                  value={formImages}
                  onChange={(e) => setFormImages(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Highlights / Specifications (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="16GB DDR5, Intel Core i7 13th Gen, 1TB SSD"
                  className="w-full bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all"
                  value={formHighlights}
                  onChange={(e) => setFormHighlights(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="gaming, core i7, asus, laptops"
                  className="w-full bg-muted/30 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-3 outline-none text-sm font-medium transition-all"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-4 border-t border-border pt-6 bg-muted/5 -mx-6 -mb-6 p-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-white border border-border text-foreground font-semibold px-6 py-3 rounded-xl hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="bg-primary text-primary-foreground font-semibold px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  {formLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    "Save Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
