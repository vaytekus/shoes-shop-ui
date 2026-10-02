export default function Footer() {
    return (
      <footer className="bg-gray-900 text-gray-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-3">Shoes Shop</h3>
            <p className="text-sm">Quality footwear store</p>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Information</h3>
            <ul className="text-sm space-y-2">
              <li>Shipping & Payment</li>
              <li>Returns & Exchanges</li>
              <li>Contact Us</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-3">Contact</h3>
            <p className="text-sm">Mon-Fri: 10:00 - 19:00</p>
            <p className="text-sm mt-1">info@shoes-shop.ua</p>
          </div>
        </div>

        <div className="border-t border-gray-800 text-center py-4 text-xs">
          © 2026 Shoes Shop
        </div>
      </footer>
    )
  }