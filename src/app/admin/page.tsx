"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  active: boolean;
};

type Movement = {
  id: number;
  product: string;
  type: "Entrada" | "Salida" | "Ajuste";
  quantity: number;
  note: string;
  date: string;
};

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Taladro percutor 1/2 pulg.",
    sku: "HER-TAL-001",
    category: "Herramientas",
    price: 1249,
    stock: 18,
    minStock: 6,
    active: true,
  },
  {
    id: 2,
    name: "Pintura vinilica blanca 19 L",
    sku: "PIN-VIN-019",
    category: "Pintura",
    price: 899,
    stock: 9,
    minStock: 10,
    active: true,
  },
  {
    id: 3,
    name: "Cemento gris 50 kg",
    sku: "MAT-CEM-050",
    category: "Materiales",
    price: 189,
    stock: 5,
    minStock: 12,
    active: true,
  },
  {
    id: 4,
    name: "Contacto duplex aterrizado",
    sku: "ELE-CON-002",
    category: "Electricidad",
    price: 64,
    stock: 32,
    minStock: 15,
    active: false,
  },
];

const initialMovements: Movement[] = [
  {
    id: 1,
    product: "Cemento gris 50 kg",
    type: "Salida",
    quantity: 4,
    note: "Venta de mostrador",
    date: "Hoy 10:20",
  },
  {
    id: 2,
    product: "Pintura vinilica blanca 19 L",
    type: "Entrada",
    quantity: 12,
    note: "Proveedor semanal",
    date: "Ayer 18:05",
  },
];

const categories = [
  "Herramientas",
  "Pintura",
  "Plomeria",
  "Electricidad",
  "Tornilleria",
  "Jardineria",
  "Materiales",
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [movements, setMovements] = useState<Movement[]>(initialMovements);
  const [selectedProductId, setSelectedProductId] = useState(
    initialProducts[0].id,
  );
  const [movementQuantity, setMovementQuantity] = useState(1);
  const [movementType, setMovementType] =
    useState<Movement["type"]>("Entrada");

  const activeProducts = products.filter((product) => product.active).length;
  const lowStockProducts = products.filter(
    (product) => product.stock <= product.minStock,
  );
  const inventoryValue = products.reduce(
    (total, product) => total + product.price * product.stock,
    0,
  );

  const selectedProduct = useMemo(
    () => products.find((product) => product.id === selectedProductId),
    [products, selectedProductId],
  );

  function addProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const sku = String(formData.get("sku") || "").trim();
    const category = String(formData.get("category") || categories[0]);
    const price = Number(formData.get("price"));
    const stock = Number(formData.get("stock"));
    const minStock = Number(formData.get("minStock"));

    if (!name || !sku || price <= 0) {
      return;
    }

    const nextProduct: Product = {
      id: Date.now(),
      name,
      sku,
      category,
      price,
      stock: Math.max(0, stock),
      minStock: Math.max(0, minStock),
      active: true,
    };

    setProducts((currentProducts) => [nextProduct, ...currentProducts]);
    event.currentTarget.reset();
  }

  function applyMovement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedProduct || movementQuantity <= 0) {
      return;
    }

    const signedQuantity =
      movementType === "Salida" ? -movementQuantity : movementQuantity;

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === selectedProduct.id
          ? {
              ...product,
              stock:
                movementType === "Ajuste"
                  ? movementQuantity
                  : Math.max(0, product.stock + signedQuantity),
            }
          : product,
      ),
    );

    setMovements((currentMovements) => [
      {
        id: Date.now(),
        product: selectedProduct.name,
        type: movementType,
        quantity: movementQuantity,
        note:
          movementType === "Ajuste"
            ? "Conteo fisico"
            : movementType === "Entrada"
              ? "Entrada de almacen"
              : "Salida de inventario",
        date: "Ahora",
      },
      ...currentMovements,
    ]);

    setMovementQuantity(1);
  }

  function toggleProduct(productId: number) {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId
          ? { ...product, active: !product.active }
          : product,
      ),
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#202020]">
      <header className="border-b border-[#ded6ca] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link className="flex items-center gap-3" href="/">
            <span className="grid size-11 place-items-center rounded bg-[#c53126] text-lg font-black text-white">
              FT
            </span>
            <span>
              <span className="block text-2xl font-black">FerreTodo</span>
              <span className="block text-xs font-semibold uppercase text-[#6f675d]">
                Administrador
              </span>
            </span>
          </Link>
          <nav className="flex gap-3 text-sm font-black">
            <Link className="rounded border border-[#202020] px-4 py-2" href="/">
              Tienda
            </Link>
            <a className="rounded bg-[#202020] px-4 py-2 text-white" href="#alta">
              Nuevo producto
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-5">
          <p className="text-sm font-bold uppercase text-[#6f675d]">
            Control de inventario
          </p>
          <h1 className="mt-1 text-4xl font-black">
            Panel administrador de FerreTodo
          </h1>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded border border-[#ded6ca] bg-white p-5">
            <p className="text-sm font-bold text-[#6f675d]">Productos activos</p>
            <strong className="mt-2 block text-4xl">{activeProducts}</strong>
          </div>
          <div className="rounded border border-[#ded6ca] bg-white p-5">
            <p className="text-sm font-bold text-[#6f675d]">Stock bajo</p>
            <strong className="mt-2 block text-4xl text-[#c53126]">
              {lowStockProducts.length}
            </strong>
          </div>
          <div className="rounded border border-[#ded6ca] bg-white p-5">
            <p className="text-sm font-bold text-[#6f675d]">
              Valor de inventario
            </p>
            <strong className="mt-2 block text-4xl">
              {formatCurrency(inventoryValue)}
            </strong>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-8 lg:grid-cols-[1fr_420px]">
        <div className="rounded border border-[#ded6ca] bg-white">
          <div className="flex flex-col gap-3 border-b border-[#ded6ca] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase text-[#6f675d]">
                Catalogo interno
              </p>
              <h2 className="text-2xl font-black">Productos</h2>
            </div>
            <span className="rounded bg-[#f2b705] px-3 py-2 text-sm font-black">
              {products.length} registrados
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead className="bg-[#202020] text-left text-white">
                <tr>
                  <th className="px-4 py-3">Producto</th>
                  <th className="px-4 py-3">Categoria</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Estado</th>
                  <th className="px-4 py-3">Accion</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const isLowStock = product.stock <= product.minStock;

                  return (
                    <tr className="border-t border-[#ded6ca]" key={product.id}>
                      <td className="px-4 py-3">
                        <strong className="block">{product.name}</strong>
                        <span className="text-xs font-bold text-[#6f675d]">
                          {product.sku}
                        </span>
                      </td>
                      <td className="px-4 py-3">{product.category}</td>
                      <td className="px-4 py-3">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            isLowStock
                              ? "font-black text-[#c53126]"
                              : "font-black text-[#1f6f34]"
                          }
                        >
                          {product.stock}
                        </span>
                        <span className="ml-2 text-xs text-[#6f675d]">
                          min. {product.minStock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {product.active ? "Activo" : "Oculto"}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="font-black text-[#c53126]"
                          onClick={() => toggleProduct(product.id)}
                        >
                          {product.active ? "Ocultar" : "Publicar"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid h-fit gap-5">
          <form
            className="rounded border border-[#ded6ca] bg-white p-4"
            id="alta"
            onSubmit={addProduct}
          >
            <h2 className="text-2xl font-black">Alta de producto</h2>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-1 text-sm font-bold">
                Nombre
                <input
                  className="rounded border border-[#ded6ca] px-3 py-2"
                  name="name"
                  placeholder="Ej. Llave stilson 14 pulg."
                  required
                />
              </label>
              <label className="grid gap-1 text-sm font-bold">
                SKU
                <input
                  className="rounded border border-[#ded6ca] px-3 py-2 uppercase"
                  name="sku"
                  placeholder="HER-LLA-014"
                  required
                />
              </label>
              <label className="grid gap-1 text-sm font-bold">
                Categoria
                <select
                  className="rounded border border-[#ded6ca] px-3 py-2"
                  name="category"
                >
                  {categories.map((category) => (
                    <option key={category}>{category}</option>
                  ))}
                </select>
              </label>
              <div className="grid gap-3 sm:grid-cols-3">
                <label className="grid gap-1 text-sm font-bold">
                  Precio
                  <input
                    className="rounded border border-[#ded6ca] px-3 py-2"
                    min="1"
                    name="price"
                    required
                    type="number"
                  />
                </label>
                <label className="grid gap-1 text-sm font-bold">
                  Stock
                  <input
                    className="rounded border border-[#ded6ca] px-3 py-2"
                    min="0"
                    name="stock"
                    required
                    type="number"
                  />
                </label>
                <label className="grid gap-1 text-sm font-bold">
                  Minimo
                  <input
                    className="rounded border border-[#ded6ca] px-3 py-2"
                    min="0"
                    name="minStock"
                    required
                    type="number"
                  />
                </label>
              </div>
              <button className="rounded bg-[#c53126] px-4 py-3 font-black text-white">
                Guardar producto
              </button>
            </div>
          </form>

          <form
            className="rounded border border-[#ded6ca] bg-white p-4"
            onSubmit={applyMovement}
          >
            <h2 className="text-2xl font-black">Movimiento de stock</h2>
            <div className="mt-4 grid gap-3">
              <label className="grid gap-1 text-sm font-bold">
                Producto
                <select
                  className="rounded border border-[#ded6ca] px-3 py-2"
                  onChange={(event) =>
                    setSelectedProductId(Number(event.target.value))
                  }
                  value={selectedProductId}
                >
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1 text-sm font-bold">
                  Tipo
                  <select
                    className="rounded border border-[#ded6ca] px-3 py-2"
                    onChange={(event) =>
                      setMovementType(event.target.value as Movement["type"])
                    }
                    value={movementType}
                  >
                    <option>Entrada</option>
                    <option>Salida</option>
                    <option>Ajuste</option>
                  </select>
                </label>
                <label className="grid gap-1 text-sm font-bold">
                  Cantidad
                  <input
                    className="rounded border border-[#ded6ca] px-3 py-2"
                    min="1"
                    onChange={(event) =>
                      setMovementQuantity(Number(event.target.value))
                    }
                    type="number"
                    value={movementQuantity}
                  />
                </label>
              </div>
              <button className="rounded bg-[#202020] px-4 py-3 font-black text-white">
                Aplicar movimiento
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-10 lg:grid-cols-[420px_1fr]">
        <aside className="rounded border border-[#ded6ca] bg-white p-4">
          <h2 className="text-2xl font-black">Alertas de stock bajo</h2>
          <div className="mt-4 grid gap-3">
            {lowStockProducts.length === 0 ? (
              <p className="rounded bg-[#dff2df] p-4 text-sm font-bold text-[#1f6f34]">
                Todo el inventario esta arriba del minimo.
              </p>
            ) : (
              lowStockProducts.map((product) => (
                <div
                  className="rounded border border-[#f1b3ab] bg-[#fff5f3] p-3"
                  key={product.id}
                >
                  <strong>{product.name}</strong>
                  <p className="mt-1 text-sm text-[#6f675d]">
                    Quedan {product.stock}; minimo recomendado {product.minStock}.
                  </p>
                </div>
              ))
            )}
          </div>
        </aside>

        <div className="rounded border border-[#ded6ca] bg-white p-4">
          <h2 className="text-2xl font-black">Ultimos movimientos</h2>
          <div className="mt-4 overflow-hidden rounded border border-[#ded6ca]">
            <div className="grid grid-cols-4 bg-[#202020] px-4 py-3 text-sm font-black text-white">
              <span>Producto</span>
              <span>Tipo</span>
              <span>Cantidad</span>
              <span>Nota</span>
            </div>
            {movements.map((movement) => (
              <div
                className="grid grid-cols-4 border-t border-[#ded6ca] px-4 py-3 text-sm"
                key={movement.id}
              >
                <span className="font-bold">{movement.product}</span>
                <span>{movement.type}</span>
                <span>{movement.quantity}</span>
                <span>
                  {movement.note}
                  <span className="block text-xs font-bold text-[#6f675d]">
                    {movement.date}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
