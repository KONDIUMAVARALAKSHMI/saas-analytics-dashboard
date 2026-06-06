// prisma/seed.ts
import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Create tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corp',
      slug: 'acme-corp',
    },
  })

  console.log('Created tenant:', tenant.slug)

  // Create admin user
  const adminPassword = await bcrypt.hash('password123', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: {
      email: 'admin@test.com',
      password: adminPassword,
      name: 'Admin User',
      role: Role.ADMIN,
      tenantId: tenant.id,
    },
  })

  console.log('Created admin user:', adminUser.email)

  // Create member user
  const memberPassword = await bcrypt.hash('password123', 12)
  const memberUser = await prisma.user.upsert({
    where: { email: 'member@test.com' },
    update: {},
    create: {
      email: 'member@test.com',
      password: memberPassword,
      name: 'Member User',
      role: Role.MEMBER,
      tenantId: tenant.id,
    },
  })

  console.log('Created member user:', memberUser.email)

  // Create analytics data
  const analyticsEntries = [
    { label: 'Revenue', value: 45230.5, category: 'finance' },
    { label: 'Users', value: 1243, category: 'engagement' },
    { label: 'Sessions', value: 8920, category: 'engagement' },
    { label: 'Conversion Rate', value: 3.4, category: 'marketing' },
    { label: 'Page Views', value: 23400, category: 'engagement' },
    { label: 'Bounce Rate', value: 42.1, category: 'engagement' },
    { label: 'Avg Session Duration', value: 185, category: 'engagement' },
    { label: 'New Users', value: 342, category: 'engagement' },
    { label: 'Returning Users', value: 901, category: 'engagement' },
    { label: 'Revenue Growth', value: 12.5, category: 'finance' },
    { label: 'Support Tickets', value: 47, category: 'support' },
    { label: 'Resolution Time', value: 24, category: 'support' },
    { label: 'filter-item-alpha', value: 100, category: 'filter' },
    { label: 'filter-item-beta', value: 200, category: 'filter' },
    { label: 'filter-item-gamma', value: 300, category: 'filter' },
    { label: 'Item A', value: 111, category: 'general' },
    { label: 'Item B', value: 222, category: 'general' },
    { label: 'Item C', value: 333, category: 'general' },
    { label: 'Item D', value: 444, category: 'general' },
    { label: 'Item E', value: 555, category: 'general' },
    { label: 'Item F', value: 666, category: 'general' },
    { label: 'Item G', value: 777, category: 'general' },
    { label: 'Item H', value: 888, category: 'general' },
    { label: 'Item I', value: 999, category: 'general' },
    { label: 'Item J', value: 1010, category: 'general' },
  ]

  for (const entry of analyticsEntries) {
    await prisma.analyticsData.create({
      data: {
        ...entry,
        tenantId: tenant.id,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      },
    })
  }

  console.log(`Created ${analyticsEntries.length} analytics entries`)
  console.log('Database seed completed!')
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
