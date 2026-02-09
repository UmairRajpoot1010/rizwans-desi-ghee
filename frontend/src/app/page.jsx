import Image from 'next/image'
import axios from 'axios'

const FEATURED_LIMIT = 4

async function getFeaturedProducts() {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/products`,
      {
        params: {
          limit: FEATURED_LIMIT,
          sort: '-createdAt',
        },
      }
    )

    const products = Array.isArray(res.data?.data) ? res.data.data : res.data
    return products.slice(0, FEATURED_LIMIT)
  } catch (error) {
    console.error('Failed to fetch featured products:', error?.message || error)
    return []
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <main className="min-h-screen bg-creamBg">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-30 border-b border-warmBrown/5 bg-creamBg/90 backdrop-blur">
        <div className="container flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gheeGold/20">
              <Image
                src="/assets/logos/ghee psd (1).png"
                alt="Rizwan's Desi Ghee Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="leading-tight">
              <p className="font-heading text-lg font-semibold text-warmBrown">
                Rizwan&apos;s Desi Ghee
              </p>
              <p className="text-xs text-oliveGreen/80">Pure • Traditional • Farm Fresh</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-warmBrown/80 md:flex">
            <a href="/" className="text-warmBrown">
              Home
            </a>
            <a href="/shop" className="hover:text-warmBrown">
              Shop
            </a>
            <a href="/about" className="hover:text-warmBrown">
              About
            </a>
            <a href="/contact" className="hover:text-warmBrown">
              Contact
            </a>
          </nav>

          {/* Cart */}
          <div className="flex items-center gap-3">
            <a
              href="/cart"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-warmBrown/10 bg-creamLight shadow-soft"
            >
              <span className="relative">
                <span className="material-icons text-warmBrown">shopping_bag</span>
              </span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-warmBrown/5 bg-gradient-to-br from-creamBg via-creamLight to-gheeGold/10">
        <div className="container flex flex-col items-center gap-10 py-12 md:flex-row md:py-20">
          {/* Left text */}
          <div className="max-w-xl space-y-6 text-center md:text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-oliveGreen">
              Premium • Traditional • Farm Fresh
            </p>
            <h1 className="font-heading text-3xl font-bold leading-tight text-warmBrown sm:text-4xl md:text-5xl">
              Pure Desi Ghee
              <br />
              <span className="text-oliveGreen">from Our Farm to Your Home</span>
            </h1>
            <p className="max-w-lg text-sm text-warmBrown/80 md:text-base">
              Traditionally prepared, 100% pure desi ghee made from farm-fresh milk. Slow-cooked in
              small batches, trusted by families for generations.
            </p>

            <div className="flex flex-col items-center gap-3 sm:flex-row md:items-start">
              <a
                href="/shop"
                className="inline-flex items-center justify-center rounded-full bg-gheeGold px-8 py-3 text-sm font-semibold text-warmBrown shadow-soft transition hover:bg-warmBrown hover:text-creamBg"
              >
                Shop Now
              </a>
              <a
                href="#why-us"
                className="inline-flex items-center justify-center rounded-full border border-warmBrown/20 bg-transparent px-8 py-3 text-sm font-semibold text-warmBrown transition hover:bg-warmBrown hover:text-creamBg"
              >
                Learn More
              </a>
            </div>

            {/* Trust badges inline on hero */}
            <div className="mt-4 grid w-full gap-3 text-xs text-warmBrown/80 sm:grid-cols-2">
              <div className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 shadow-soft">
                <span className="h-6 w-6 rounded-full bg-gheeGold/20 text-center text-sm leading-6 text-oliveGreen">
                  ✓
                </span>
                <span>100% Pure Desi Ghee</span>
              </div>
              <div className="flex items-center gap-2 rounded-xl bg-white/70 px-3 py-2 shadow-soft">
                <span className="h-6 w-6 rounded-full bg-gheeGold/20 text-center text-sm leading-6 text-oliveGreen">
                  ✓
                </span>
                <span>Traditional Bilona Method</span>
              </div>
            </div>
          </div>

          {/* Right image */}
          <div className="relative flex w-full max-w-md items-center justify-center">
            <div className="absolute inset-0 -z-10 rounded-full bg-gheeGold/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-warmBrown/10 bg-creamLight p-4 shadow-soft">
              <div className="relative h-80 w-64 sm:h-96 sm:w-72">
                <Image
                  src="/assets/images/Gemini_Generated_Image_iqcsg4iqcsg4iqcs.png"
                  alt="Rizwan's Desi Ghee Bottle"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="mt-4 space-y-1 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-oliveGreen">
                  Farm Fresh • Hand Churned
                </p>
                <p className="font-heading text-lg font-semibold text-warmBrown">
                  Premium Cow Desi Ghee
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust badges row */}
      <section className="border-b border-warmBrown/5 bg-creamLight/70 py-6">
        <div className="container grid gap-4 text-sm text-warmBrown/90 sm:grid-cols-2 md:grid-cols-4">
          {[
            { label: '100% Pure', sub: 'No blending, no compromise' },
            { label: 'Traditional Method', sub: 'Hand-churned bilona ghee' },
            { label: 'Cash on Delivery', sub: 'Pay when you receive' },
            { label: 'Fast Delivery', sub: 'Pan-India shipping' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-soft"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gheeGold/20 text-oliveGreen">
                ✓
              </div>
              <div>
                <p className="text-sm font-semibold text-warmBrown">{item.label}</p>
                <p className="text-xs text-warmBrown/70">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="border-b border-warmBrown/5 bg-creamBg py-10 md:py-14">
        <div className="container space-y-6">
          <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-oliveGreen">
                Our Products
              </p>
              <h2 className="font-heading text-2xl font-semibold text-warmBrown md:text-3xl">
                Featured Desi Ghee Packs
              </h2>
            </div>
            <a
              href="/shop"
              className="text-sm font-medium text-oliveGreen underline-offset-4 hover:underline"
            >
              View all products
            </a>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {featuredProducts.length === 0 && (
              <p className="col-span-full text-sm text-warmBrown/70">
                Products will appear here once added from the admin panel.
              </p>
            )}

            {featuredProducts.map((product) => (
              <article
                key={product._id}
                className="flex flex-col overflow-hidden rounded-card border border-warmBrown/10 bg-white shadow-soft"
              >
                <div className="relative h-40 w-full bg-creamLight">
                  <Image
                    src={product.images?.[0] || '/assets/images/Gemini_Generated_Image_iqcsg4iqcsg4iqcs.png'}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="font-heading text-base font-semibold text-warmBrown">
                    {product.name}
                  </h3>
                  <p className="text-xs text-warmBrown/60">
                    {product.weight || '500g / 1kg'} • Pure Desi Ghee
                  </p>
                  <p className="mt-1 text-sm font-semibold text-oliveGreen">
                    ₹{Number(product.price).toLocaleString('en-IN')}
                  </p>
                  <button
                    type="button"
                    className="mt-2 inline-flex items-center justify-center rounded-full bg-gheeGold px-3 py-2 text-xs font-semibold text-warmBrown shadow-soft transition hover:bg-warmBrown hover:text-creamBg"
                  >
                    Add to Cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section id="why-us" className="border-b border-warmBrown/5 bg-creamLight/60 py-10 md:py-14">
        <div className="container grid gap-8 md:grid-cols-[1.1fr,1.2fr] md:items-center">
          {/* Farm image placeholder using bottle image as hero */}
          <div className="relative overflow-hidden rounded-[1.75rem] border border-warmBrown/10 bg-oliveGreen/5 p-4 shadow-soft">
            <div className="absolute inset-0 bg-gradient-to-tr from-oliveGreen/10 via-transparent to-gheeGold/20" />
            <div className="relative h-64 w-full">
              <Image
                src="/assets/images/Gemini_Generated_Image_iqcsg4iqcsg4iqcs.png"
                alt="Farm fresh desi ghee"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-oliveGreen">
              Why Choose Rizwan&apos;s Desi Ghee
            </p>
            <h2 className="font-heading text-2xl font-semibold text-warmBrown md:text-3xl">
              Farm-fresh purity in every spoon
            </h2>
            <p className="text-sm text-warmBrown/80">
              Our desi ghee is slowly prepared from farm-fresh cow&apos;s milk using the traditional
              bilona method. No shortcuts, no premix, no compromise on taste and purity.
            </p>
            <ul className="space-y-2 text-sm text-warmBrown/90">
              {[
                'Farm-fresh milk sourced from trusted dairies',
                'Hand-churned butter for authentic flavor',
                'No chemicals, preservatives or additives',
                'Traditional slow-cooking process for rich aroma',
              ].map((point) => (
                <li key={point} className="flex items-start gap-2">
                  <span className="mt-1 h-4 w-4 rounded-full bg-gheeGold/30 text-center text-[10px] leading-4 text-oliveGreen">
                    ✓
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Process section */}
      <section className="border-b border-warmBrown/5 bg-creamBg py-10 md:py-14">
        <div className="container space-y-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-oliveGreen">
              Our Process
            </p>
            <h2 className="font-heading text-2xl font-semibold text-warmBrown md:text-3xl">
              From Milk to Golden Ghee
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            {[
              { title: 'Fresh Milk', desc: 'Sourced daily from healthy cows' },
              { title: 'Curd & Butter', desc: 'Slowly cultured and hand-churned' },
              { title: 'Slow Heating', desc: 'Traditional low-flame simmering' },
              { title: 'Pure Ghee', desc: 'Filtered and bottled with care' },
            ].map((step, index) => (
              <div
                key={step.title}
                className="relative flex flex-col items-center rounded-2xl border border-warmBrown/10 bg-white px-4 py-6 shadow-soft"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gheeGold/20 text-xs font-semibold text-oliveGreen">
                  {index + 1}
                </div>
                <h3 className="text-sm font-semibold text-warmBrown">{step.title}</h3>
                <p className="mt-1 text-xs text-warmBrown/70 text-center">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer reviews */}
      <section className="border-b border-warmBrown/5 bg-creamLight/60 py-10 md:py-14">
        <div className="container space-y-6">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-oliveGreen">
              Customer Love
            </p>
            <h2 className="font-heading text-2xl font-semibold text-warmBrown md:text-3xl">
              Trusted by Families
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                name: 'Ayesha Khan',
                text: 'Best desi ghee we have used in years. The aroma reminds me of my nani’s homemade ghee.',
              },
              {
                name: 'Rahul Verma',
                text: 'Perfect for daily use and sweets. My kids love the taste, and I trust the quality.',
              },
              {
                name: 'Fatima Siddiqui',
                text: 'Pure, flavorful and light. You can immediately taste the difference from regular ghee.',
              },
            ].map((review) => (
              <article
                key={review.name}
                className="flex h-full flex-col justify-between rounded-2xl border border-warmBrown/10 bg-white p-5 shadow-soft"
              >
                <div className="mb-3 flex items-center gap-1 text-gheeGold">
                  {'★★★★★'}
                </div>
                <p className="text-sm text-warmBrown/80">{review.text}</p>
                <p className="mt-3 text-sm font-semibold text-warmBrown">{review.name}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-warmBrown text-creamBg">
        <div className="container grid gap-8 py-10 md:grid-cols-[1.5fr,1fr,1fr]">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gheeGold/20">
                <Image
                  src="/assets/logos/ghee psd (1).png"
                  alt="Rizwan's Desi Ghee Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="font-heading text-lg font-semibold">Rizwan&apos;s Desi Ghee</p>
            </div>
            <p className="max-w-md text-sm text-creamBg/80">
              Premium, traditionally prepared desi ghee made from farm-fresh milk. Bringing the taste
              of authentic ghar ka ghee to your kitchen.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Contact</h3>
            <ul className="mt-3 space-y-1 text-sm text-creamBg/80">
              <li>WhatsApp: +91-98765-43210</li>
              <li>Email: support@rizwansdesighee.com</li>
            </ul>
            <div className="mt-3 flex gap-3 text-sm text-creamBg/80">
              <a href="#" className="hover:text-gheeGold">
                Instagram
              </a>
              <a href="#" className="hover:text-gheeGold">
                Facebook
              </a>
              <a href="#" className="hover:text-gheeGold">
                YouTube
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="mt-3 space-y-1 text-sm text-creamBg/80">
              <li>
                <a href="/shop" className="hover:text-gheeGold">
                  Shop
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-gheeGold">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-gheeGold">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gheeGold">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-creamBg/10 py-4 text-center text-xs text-creamBg/70">
          © {new Date().getFullYear()} Rizwan&apos;s Desi Ghee. All rights reserved.
        </div>
      </footer>
    </main>
  )
}
