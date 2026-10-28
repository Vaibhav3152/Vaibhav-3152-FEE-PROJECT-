import { useState, useEffect } from "react";
import { fetchWithRetry, getFriendlyError, prettyCategory } from "../utils/api.js";
import { API_URL } from "../store/productStore.js";
import { useToast } from "../context/ToastContext.jsx";
import { useForm } from "../hooks/useForm.js";
import Field from "./ui/Field.jsx";
import Modal from "./ui/Modal.jsx";
import { LoadingMessage, ErrorMessage, EmptyMessage } from "./ui/StatusMessage.jsx";

const jsonHeaders = { "Content-Type": "application/json" };

function validate(values) {
  const errors = {};
  if (values.title.trim().length < 3) errors.title = "Title needs at least 3 characters.";
  if (values.category.trim() === "") errors.category = "Category is required.";
  if (!(Number(values.price) > 0)) errors.price = "Price must be more than 0.";
  if (!Number.isInteger(Number(values.stock)) || values.stock === "" || Number(values.stock) < 0) errors.stock = "Stock must be a whole number, 0 or more.";
  return errors;
}

// the same form is used to ADD and to EDIT (product is empty when adding)
function ProductForm({ product, isSaving, onSave, onCancel }) {
  const start = product
    ? { title: product.title, category: product.category, price: String(product.price), stock: String(product.stock) }
    : { title: "", category: "", price: "", stock: "" };

  const form = useForm(start, validate);

  const fieldProps = (name) => ({
    name,
    value: form.values[name],
    onChange: form.handleChange,
    onBlur: form.handleBlur,
    error: form.getError(name),
  });

  const save = (v) => onSave({ title: v.title.trim(), category: v.category.trim(), price: Number(v.price), stock: Number(v.stock) });

  return (
    <form onSubmit={form.handleSubmit(save)} noValidate className="form-grid">
      <Field label="Title" {...fieldProps("title")} />
      <Field label="Category" {...fieldProps("category")} />
      <Field label="Price ($)" type="number" step="0.01" {...fieldProps("price")} />
      <Field label="Stock" type="number" {...fieldProps("stock")} />
      <div className="row">
        <button type="submit" className="btn btn--primary" disabled={isSaving}>{isSaving ? "Saving..." : "Save"}</button>
        <button type="button" className="btn" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

// CRUD WORKFLOW with a REST API
//   Create = POST /products/add     Read = GET /products
//   Update = PUT /products/:id      Delete = DELETE /products/:id
// The practice API answers like it saved, but does not really store the
// change, so after each answer we also update our own list.
export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [filterText, setFilterText] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // the product being edited, or null when adding
  const [deleting, setDeleting] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  // READ
  useEffect(() => {
    let ignore = false;

    async function loadProducts() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchWithRetry(API_URL + "/products?limit=10&select=title,price,category,stock");
        if (!ignore) setProducts(data.products);
      } catch (err) {
        if (!ignore) setError(getFriendlyError(err));
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadProducts();
    return () => {
      ignore = true;
    };
  }, [retryCount]);

  // runs a request, then runs onDone with the answer; handles saving state + errors
  const runRequest = async (url, options, onDone, successText) => {
    setIsSaving(true);
    try {
      const answer = await fetchWithRetry(url, options);
      onDone(answer);
      showToast(successText, "success");
    } catch (err) {
      showToast(getFriendlyError(err), "error");
    } finally {
      setIsSaving(false);
    }
  };

  // CREATE or UPDATE
  const saveProduct = (values) => {
    const body = JSON.stringify(values);

    if (editing === null) {
      runRequest(API_URL + "/products/add", { method: "POST", headers: jsonHeaders, body }, (answer) => {
        setProducts([{ ...values, id: answer.id, isNew: true }, ...products]);
        setIsFormOpen(false);
      }, "Product added");
      return;
    }

    const updateList = () => {
      setProducts(products.map((p) => (p.id === editing.id ? { ...p, ...values } : p)));
      setIsFormOpen(false);
    };

    // products we added ourselves do not exist on the server, so only update our list
    if (editing.isNew) {
      updateList();
      showToast("Product updated", "success");
    } else {
      runRequest(API_URL + "/products/" + editing.id, { method: "PUT", headers: jsonHeaders, body }, updateList, "Product updated");
    }
  };

  // DELETE
  const deleteProduct = () => {
    const removeFromList = () => {
      setProducts(products.filter((p) => p.id !== deleting.id));
      setDeleting(null);
    };

    if (deleting.isNew) {
      removeFromList();
      showToast("Product deleted", "success");
    } else {
      runRequest(API_URL + "/products/" + deleting.id, { method: "DELETE" }, removeFromList, "Product deleted");
    }
  };

  const search = filterText.trim().toLowerCase();
  const visibleProducts = products.filter(
    (p) => p.title.toLowerCase().includes(search) || p.category.toLowerCase().includes(search)
  );

  return (
    <div>
      <div className="toolbar">
        <div className="field toolbar__grow">
          <label htmlFor="manager-filter">Filter the table</label>
          <input id="manager-filter" type="search" className="input" value={filterText} onChange={(e) => setFilterText(e.target.value)} />
        </div>
        <button type="button" className="btn btn--primary" onClick={() => { setEditing(null); setIsFormOpen(true); }}>
          + Add product
        </button>
      </div>

      {loading && <LoadingMessage text="Loading products..." />}
      {error && <ErrorMessage message={error} onRetry={() => setRetryCount(retryCount + 1)} />}
      {!loading && !error && visibleProducts.length === 0 && <EmptyMessage text="No products to show." />}

      {visibleProducts.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Title</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {visibleProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.id}</td>
                  <td>{product.title}</td>
                  <td>{prettyCategory(product.category)}</td>
                  <td>${Number(product.price).toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <div className="row">
                      <button type="button" className="btn btn--sm" onClick={() => { setEditing(product); setIsFormOpen(true); }}>Edit</button>
                      <button type="button" className="btn btn--sm btn--danger" onClick={() => setDeleting(product)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal title={editing ? "Edit product" : "Add product"} isOpen={isFormOpen} onClose={() => setIsFormOpen(false)}>
        <ProductForm product={editing} isSaving={isSaving} onSave={saveProduct} onCancel={() => setIsFormOpen(false)} />
      </Modal>

      <Modal title="Delete product?" isOpen={deleting !== null} onClose={() => setDeleting(null)}>
        {deleting && (
          <div>
            <p>Delete <strong>{deleting.title}</strong>?</p>
            <div className="row">
              <button type="button" className="btn btn--danger" disabled={isSaving} onClick={deleteProduct}>Yes, delete</button>
              <button type="button" className="btn" onClick={() => setDeleting(null)}>Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
