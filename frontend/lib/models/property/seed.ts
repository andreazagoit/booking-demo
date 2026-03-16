import { dbCreateProperty, PROPERTIES_TABLE } from "./operations"

export { PROPERTIES_TABLE }

const SEED_PROPERTIES = [
  { name: "Villa Toscana", description: "Splendida villa nel cuore della Toscana con piscina e vista sulle colline.", location: "Chianti, Toscana", imageUrl: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=800", pricePerNight: 350 },
  { name: "Masseria Pugliese", description: "Masseria storica con ulivi secolari e piscina immersa nella natura.", location: "Valle d'Itria, Puglia", imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", pricePerNight: 280 },
  { name: "Trullo Alberobello", description: "Autentico trullo nel centro storico di Alberobello, patrimonio UNESCO.", location: "Alberobello, Puglia", imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800", pricePerNight: 190 },
  { name: "Chalet Dolomiti", description: "Chalet di lusso con vista mozzafiato sulle Dolomiti, ski-in ski-out.", location: "Cortina d'Ampezzo, Veneto", imageUrl: "https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800", pricePerNight: 420 },
  { name: "Casale Umbro", description: "Casale rustico ristrutturato in Umbria, tra boschi e vigneti.", location: "Montefalco, Umbria", imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800", pricePerNight: 220 },
  { name: "Agriturismo Siciliano", description: "Agriturismo con vista sull'Etna, produzione propria di olio e vino.", location: "Etna, Sicilia", imageUrl: "https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800", pricePerNight: 160 },
]

// ownerIds: [owner1Id, owner2Id] — 3 properties each
export async function seedPropertyData(ownerIds: string[]) {
  const created = []
  for (let i = 0; i < SEED_PROPERTIES.length; i++) {
    const userId = ownerIds[Math.floor(i / 3) % ownerIds.length]
    const property = await dbCreateProperty(userId, SEED_PROPERTIES[i])
    created.push(property)
  }
  console.log(`[seed] Inserted ${created.length} properties`)
  return created
}
