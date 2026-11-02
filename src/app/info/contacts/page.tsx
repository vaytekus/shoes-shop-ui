export default function ContactsPage() {
  return (
    <div className="flex flex-col gap-6 flex-1 min-h-0">
      <h1 className="text-2xl font-semibold shrink-0">Контакти</h1>

      <div className="flex gap-10 flex-1 min-h-0">
        <div className="text-sm text-gray-600 space-y-2 shrink-0">
          <p>Телефон: <a href="tel:+380000000000" className="text-gray-900 hover:underline">+38 (000) 000-00-00</a></p>
          <p>Email: <a href="mailto:info@shoesshop.ua" className="text-gray-900 hover:underline">info@shoesshop.ua</a></p>
          <p>Графік роботи: Пн–Пт 9:00–18:00</p>
        </div>

        <iframe
          src="https://maps.google.com/maps?q=Kyiv,Ukraine&t=&z=13&ie=UTF8&iwloc=&output=embed"
          className="flex-1 min-w-0 rounded border border-gray-200"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  )
}
