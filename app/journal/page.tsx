"use client"

import { Header } from "@/components/Header"
import  Footer  from "@/components/Footer"
import { Button } from "@/components/ui/button"

export default function JournalPage() {
  const journalArticles = [
  {
    id: "golden-spines-bomber",
    title: "GOLDEN SPINES BOMBER",
    date: "March 15, 2025",
    excerpt:
      "A luxury-street hybrid bomber featuring gold ray-like spines over deep black denim, built for confidence and bold presence.",
    image: "/journal-1.jpg",
    content:
      "Featuring bold, gold ray-like spines bursting across deep black denim, this bomber blends luxury aesthetics with a sharp streetwear edge. Designed with a structured baggy fit, premium materials, and warm lining, it delivers comfort, durability, and unmistakable presence. Wear it when you want confidence to speak before you do.",
  },

  {
    id: "blue-pullover",
    title: "BLUE PULLOVER",
    date: "February 28, 2025",
    excerpt:
      "A clean sky-tone half-zip sweatshirt made for effortless layering and modern minimal street style.",
    image: "/journal-2.jpg",
    content:
      "A clean, sky-tone half-zip sweatshirt blending minimal street style with everyday comfort. The Amalfi Breeze Half-Zip features a soft pastel body with a smooth finish that stays structured through regular wear. With a relaxed, modern fit that sits neatly on the shoulders and chest, it pairs effortlessly with jeans, joggers, or chinos.",
  },

  {
    id: "white-pullover",
    title: "WHITE PULLOVER",
    date: "February 10, 2025",
    excerpt:
      "A crisp, versatile white pullover designed for comfort, layering, and everyday wear.",
    image: "/journal-3.jpg",
    content:
      "A clean and versatile white pullover crafted from midweight fabric for perfect everyday usability. Featuring a relaxed silhouette, ribbed details, and a refined minimal aesthetic, it layers effortlessly while maintaining comfort and structure. Ideal for casual, street, or semi-polished looks.",
  },

  {
    id: "tiger-crest-bomber",
    title: "TIGER CREST BOMBER",
    date: "January 20, 2025",
    excerpt:
      "A light blue denim bomber with a bold embroidered tiger-and-palm crest motif that merges streetwear attitude with artisanal detailing.",
    image: "/journal-4.jpg",
    content:
      "The Tiger Crest Bomber is a light blue denim jacket featuring a striking embroidered crest-style tiger with palm detailing on the back. Designed with streetwear attitude and artisanal precision, it blends a relaxed fit with standout craftsmanship to create a powerful statement piece.",
  },
];

    
    

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Journal Header */}
        <section className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
          <h1 className="text-4xl lg:text-5xl font-heading font-bold mb-4">Journal</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Stories, insights, and behind-the-scenes looks at Tony Amalfi's creative process and philosophy.
          </p>
        </section>

        {/* Featured Article */}
        <section className="container mx-auto px-4 lg:px-8 mb-16 lg:mb-24">
          <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={journalArticles[0].image || "/placeholder.svg"}
                alt={journalArticles[0].title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-4">Featured</p>
              <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-4">{journalArticles[0].title}</h2>
              <p className="text-sm text-muted-foreground mb-6">{journalArticles[0].date}</p>
              <p className="text-lg text-foreground/80 mb-8">{journalArticles[0].excerpt}</p>
              <Button variant="default" className="w-fit">
                Read Full Article
              </Button>
            </div>
          </article>
        </section>

        {/* Articles Grid */}
        <section className="container mx-auto px-4 lg:px-8 pb-16 lg:pb-24">
          <h3 className="text-2xl font-heading font-bold mb-12">More Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {journalArticles.slice(1).map((article) => (
              <article key={article.id} className="group">
                <div className="aspect-[3/4] overflow-hidden mb-4">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover transition-base group-hover:scale-105"
                  />
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{article.date}</p>
                <h3 className="text-lg font-heading font-bold mb-3 uppercase tracking-wider">{article.title}</h3>
                <p className="text-sm text-foreground/80 mb-4 line-clamp-3">{article.excerpt}</p>
                <Button variant="link" className="text-foreground hover:text-foreground/80 p-0 h-auto text-sm">
                  Read More
                </Button>
              </article>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
