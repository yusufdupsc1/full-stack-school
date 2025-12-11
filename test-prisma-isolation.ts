import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({ log: ['query'] })

async function main() {
    console.log('Successfully instantiated PrismaClient')
    try {
        // Just try to connect or query something simple
        const count = await prisma.admin.count()
        console.log('Admin count:', count)
    } catch (e) {
        console.error('Error querying:', e)
    } finally {
        await prisma.$disconnect()
    }
}

main()
