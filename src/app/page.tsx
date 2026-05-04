"use client";

import { useMemo, useState } from "react";

const categories = [
  "Herramientas",
  "Pintura",
  "Plomeria",
  "Electricidad",
  "Tornilleria",
  "Jardineria",
];

const featuredProducts = [
  {
    name: "Taladro percutor 1/2 pulg.",
    category: "Herramientas",
    price: 1249,
    stock: 18,
    badge: "Mas vendido",
  },
  {
    name: "Pintura vinilica blanca 19 L",
    category: "Pintura",
    price: 899,
    stock: 9,
    badge: "Oferta",
  },
  {
    name: "Mezcladora para lavabo cromo",
    category: "Plomeria",
    price: 459,
    stock: 24,
    badge: "Entrega hoy",
  },
  {
    name: "Cable THW calibre 12 por metro",
    category: "Electricidad",
    price: 18,
    stock: 130,
    badge: "Por metro",
  },
];

const adminStats = [
  { label: "Productos activos", value: "428" },
  { label: "Stock bajo", value: "17" },
  { label: "Pedidos hoy", value: "12" },
];

type Product = (typeof featuredProducts)[number];
type CartItem = Product & { quantity: number };

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value);

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const previewCart = useMemo(
    () =>
      cart.length > 0
        ? cart
        : featuredProducts.slice(0, 3).map((product) => ({
            ...product,
            quantity: 1,
          })),
    [cart],
  );

  const previewTotal = previewCart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  function addToCart(product: Product) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.name === product.name);

      if (existingItem) {
        return currentCart.map((item) =>
          item.name === product.name
            ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
            : item,
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  }

  function updateQuantity(productName: string, quantity: number) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.name === productName
            ? {
                ...item,
                quantity: Math.max(0, Math.min(quantity, item.stock)),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeFromCart(productName: string) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.name !== productName),
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#202020]">
      <header className="border-b border-[#ded6ca] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center justify-between gap-4">
            <a href="#" className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded bg-[#c53126] text-lg font-black text-white">
                FT
              </span>
              <span>
                <span className="block text-2xl font-black tracking-normal">
                  FerreTodo
                </span>
                <span className="block text-xs font-semibold uppercase text-[#6f675d]">
                  Tlapaleria y ferreteria
                </span>
              </span>
            </a>
            <a
              href="#carrito"
              className="rounded border border-[#202020] px-4 py-2 text-sm font-bold lg:hidden"
            >
              Carrito {cartCount}
            </a>
          </div>

          <form className="flex min-w-0 flex-1 rounded border-2 border-[#202020] bg-white lg:max-w-2xl">
            <input
              aria-label="Buscar productos"
              className="min-w-0 flex-1 px-4 py-3 text-sm outline-none"
              placeholder="Buscar cemento, brochas, tornillos, cables..."
            />
            <button
              className="bg-[#f2b705] px-5 text-sm font-black text-[#202020]"
              type="submit"
            >
              Buscar
            </button>
          </form>

          <nav className="hidden items-center gap-3 text-sm font-bold lg:flex">
            <a href="#categorias">Categorias</a>
            <a href="/admin">Admin</a>
            <a
              href="#carrito"
              className="rounded bg-[#202020] px-4 py-3 text-white"
            >
              Carrito {cartCount} | {formatCurrency(cartTotal)}
            </a>
          </nav>
        </div>
      </header>

      <section className="bg-[#202020] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center lg:py-14">
          <div>
            <p className="mb-3 text-sm font-bold uppercase text-[#f2b705]">
              Compra en linea o recoge en tienda
            </p>
            <h1 className="max-w-3xl text-4xl font-black tracking-normal sm:text-5xl">
              Herramientas, materiales y refacciones listas para tu proyecto.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#e6dfd4]">
              FerreTodo combina catalogo, carrito, pagos e inventario para que
              tus clientes sepan que hay disponible antes de comprar.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#productos"
                className="rounded bg-[#f2b705] px-6 py-3 text-center font-black text-[#202020]"
              >
                Ver productos
              </a>
              <a
                href="/admin"
                className="rounded border border-white/40 px-6 py-3 text-center font-black"
              >
                Panel administrador
              </a>
            </div>
          </div>

          <div
            className="grid gap-3 rounded bg-white p-4 text-[#202020]"
            id="carrito"
          >
            <div className="flex items-center justify-between border-b border-[#ded6ca] pb-3">
              <span className="font-black">
                {cart.length > 0 ? "Tu carrito" : "Pedido rapido"}
              </span>
              <span className="rounded bg-[#dff2df] px-3 py-1 text-xs font-bold text-[#1f6f34]">
                Stock validado
              </span>
            </div>
            <div className="space-y-3 text-sm">
              {previewCart.map((item) => (
                <div className="flex justify-between gap-3" key={item.name}>
                  <span>
                    {item.name}
                    <span className="ml-2 text-xs font-bold text-[#6f675d]">
                      x{item.quantity}
                    </span>
                  </span>
                  <strong>{formatCurrency(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>
            <div className="flex justify-between border-t border-[#ded6ca] pt-3 text-lg font-black">
              <span>Total</span>
              <span>{formatCurrency(cart.length > 0 ? cartTotal : previewTotal)}</span>
            </div>
            <button className="rounded bg-[#c53126] px-4 py-3 font-black text-white">
              Pagar con Mercado Pago
            </button>
          </div>
        </div>
      </section>

      <section id="categorias" className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-black">Categorias principales</h2>
          <a href="#productos" className="text-sm font-bold text-[#c53126]">
            Ver catalogo completo
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <a
              className="rounded border border-[#ded6ca] bg-white p-4 font-black transition hover:border-[#c53126]"
              href="#productos"
              key={category}
            >
              {category}
            </a>
          ))}
        </div>
      </section>

      <section id="productos" className="mx-auto max-w-7xl px-5 py-8">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase text-[#6f675d]">
              Catalogo inicial
            </p>
            <h2 className="text-2xl font-black">Productos destacados</h2>
          </div>
          <button className="rounded bg-[#202020] px-4 py-2 text-sm font-bold text-white">
            Filtrar
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <article
              className="rounded border border-[#ded6ca] bg-white p-4"
              key={product.name}
            >
              <div className="mb-4 grid aspect-[4/3] place-items-center rounded bg-[#eee6da] text-5xl font-black text-[#c53126]">
                {product.category.slice(0, 1)}
              </div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="rounded bg-[#f2b705] px-2 py-1 text-xs font-black">
                  {product.badge}
                </span>
                <span className="text-xs font-bold text-[#1f6f34]">
                  {product.stock} disponibles
                </span>
              </div>
              <p className="text-sm font-bold text-[#6f675d]">
                {product.category}
              </p>
              <h3 className="mt-1 min-h-12 text-lg font-black">
                {product.name}
              </h3>
              <div className="mt-4 flex items-center justify-between gap-3">
                <strong className="text-2xl">
                  {formatCurrency(product.price)}
                </strong>
                <button
                  className="rounded bg-[#c53126] px-4 py-2 text-sm font-black text-white transition hover:bg-[#a9271f]"
                  onClick={() => addToCart(product)}
                >
                  Agregar
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <div className="rounded border border-[#ded6ca] bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase text-[#6f675d]">
                  Compra actual
                </p>
                <h2 className="text-2xl font-black">Carrito de compras</h2>
              </div>
              {cart.length > 0 ? (
                <button
                  className="text-sm font-black text-[#c53126]"
                  onClick={() => setCart([])}
                >
                  Vaciar carrito
                </button>
              ) : null}
            </div>

            {cart.length === 0 ? (
              <div className="rounded bg-[#f6f3ee] p-5 text-sm font-bold text-[#6f675d]">
                Aun no hay productos agregados. Elige algo del catalogo para
                comenzar el pedido.
              </div>
            ) : (
              <div className="grid gap-3">
                {cart.map((item) => (
                  <div
                    className="grid gap-3 rounded border border-[#ded6ca] p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center"
                    key={item.name}
                  >
                    <div>
                      <p className="font-black">{item.name}</p>
                      <p className="text-sm font-bold text-[#6f675d]">
                        {item.category} | {formatCurrency(item.price)} c/u |{" "}
                        {item.stock} disponibles
                      </p>
                    </div>
                    <div className="flex w-fit items-center rounded border border-[#ded6ca]">
                      <button
                        className="px-3 py-2 font-black"
                        onClick={() =>
                          updateQuantity(item.name, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span className="min-w-10 px-3 text-center font-black">
                        {item.quantity}
                      </span>
                      <button
                        className="px-3 py-2 font-black"
                        onClick={() =>
                          updateQuantity(item.name, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <div className="flex items-center justify-between gap-4 sm:block sm:text-right">
                      <strong>{formatCurrency(item.price * item.quantity)}</strong>
                      <button
                        className="block text-sm font-black text-[#c53126] sm:mt-2"
                        onClick={() => removeFromCart(item.name)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="h-fit rounded border border-[#ded6ca] bg-white p-4">
            <h3 className="text-xl font-black">Resumen</h3>
            <div className="mt-4 grid gap-3 text-sm">
              <div className="flex justify-between">
                <span>Articulos</span>
                <strong>{cartCount}</strong>
              </div>
              <div className="flex justify-between">
                <span>Subtotal</span>
                <strong>{formatCurrency(cartTotal)}</strong>
              </div>
              <div className="flex justify-between text-[#1f6f34]">
                <span>Inventario</span>
                <strong>Disponible</strong>
              </div>
            </div>
            <div className="mt-4 flex justify-between border-t border-[#ded6ca] pt-4 text-xl font-black">
              <span>Total</span>
              <span>{formatCurrency(cartTotal)}</span>
            </div>
            <button
              className="mt-4 w-full rounded bg-[#c53126] px-4 py-3 font-black text-white disabled:cursor-not-allowed disabled:bg-[#cbbfba]"
              disabled={cart.length === 0}
            >
              Continuar al pago
            </button>
          </aside>
        </div>
      </section>

      <section
        id="admin"
        className="mx-auto grid max-w-7xl gap-5 px-5 py-10 lg:grid-cols-[0.85fr_1.15fr]"
      >
        <div>
          <p className="text-sm font-bold uppercase text-[#6f675d]">
            Control interno
          </p>
          <h2 className="mt-1 text-3xl font-black">
            Panel para administrar inventario, pedidos y productos.
          </h2>
          <p className="mt-4 leading-7 text-[#5b554e]">
            Esta seccion sera privada para el administrador. Desde aqui podras
            actualizar stock, publicar productos, revisar ventas y preparar
            pedidos.
          </p>
        </div>
        <div className="grid gap-4 rounded border border-[#ded6ca] bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {adminStats.map((stat) => (
              <div className="rounded bg-[#f6f3ee] p-4" key={stat.label}>
                <p className="text-sm font-bold text-[#6f675d]">{stat.label}</p>
                <strong className="mt-2 block text-3xl">{stat.value}</strong>
              </div>
            ))}
          </div>
          <div className="overflow-hidden rounded border border-[#ded6ca]">
            <div className="grid grid-cols-3 bg-[#202020] px-4 py-3 text-sm font-black text-white">
              <span>Producto</span>
              <span>Stock</span>
              <span>Accion</span>
            </div>
            {["Cemento gris 50 kg", "Cinta teflon", "Contacto duplex"].map(
              (item, index) => (
                <div
                  className="grid grid-cols-3 border-t border-[#ded6ca] px-4 py-3 text-sm"
                  key={item}
                >
                  <span className="font-bold">{item}</span>
                  <span>{index === 0 ? "5" : index === 1 ? "42" : "11"}</span>
                  <button className="text-left font-black text-[#c53126]">
                    Ajustar
                  </button>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#ded6ca] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-sm text-[#6f675d] sm:flex-row sm:items-center sm:justify-between">
          <strong className="text-[#202020]">FerreTodo</strong>
          <span>Catalogo, carrito, pagos e inventario para tu tlapaleria.</span>
        </div>
      </footer>
    </main>
  );
}
