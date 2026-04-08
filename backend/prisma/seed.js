const { PrismaClient } = require('../generated/prisma');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function main() {
  const users = [];

  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        username: faker.internet.username(),
        email: faker.internet.email(),
        password: faker.internet.password(),

        profiles: {
          create: {
            profilePic: faker.image.avatar(),
            coverPic: faker.image.url(),
          },
        },
      },
    });

    users.push(user);
  }

  for (let i = 0; i < 15; i++) {
    const user1 = faker.helpers.arrayElement(users);
    let user2 = faker.helpers.arrayElement(users);

    while (user1.id === user2.id) {
      user2 = faker.helpers.arrayElement(users);
    }

    try {
      await prisma.friends.create({
        data: {
          userId1: user1.id,
          userId2: user2.id,
        },
      });
    } catch (e) {}
  }

  for (let i = 0; i < 30; i++) {
    const sender = faker.helpers.arrayElement(users);
    let receiver = faker.helpers.arrayElement(users);

    while (sender.id === receiver.id) {
      receiver = faker.helpers.arrayElement(users);
    }

    await prisma.messages.create({
      data: {
        message: faker.lorem.sentence(),
        senderId: sender.id,
        receiverId: receiver.id,
        createdAt: faker.date.recent(),
      },
    });
  }

  console.log('✅ Faker data inserted!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
