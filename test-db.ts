import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    console.log('Connecting...')
    try {
        await prisma.$connect()
        console.log('Connected!')
    } catch (e: any) {
        console.error('Connection failed:', e.message)
    }
}
main()
