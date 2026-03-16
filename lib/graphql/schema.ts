import { userTypeDefs } from "@/lib/models/user/schema"
import { propertyTypeDefs } from "@/lib/models/property/schema"
import { bookingTypeDefs } from "@/lib/models/booking/schema"

// Compose all typeDefs from individual models
export const typeDefs = [userTypeDefs, propertyTypeDefs, bookingTypeDefs]
