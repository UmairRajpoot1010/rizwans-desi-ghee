import React from 'react'
import App from './App'

export default function Page() {
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "Rizwan’s Desi Ghee",
        url: "https://desigheepk.com",
        logo: "https://desigheepk.com/logo.png",
        description:
          "100% pure desi ghee in Pakistan. Fresh, natural, homemade ghee.",
        sameAs: [
          "https://www.facebook.com/yourpage",
          "https://www.instagram.com/yourpage"
        ]
      })
    }}
  />
  return <App />
}
