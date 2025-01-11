import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  // Seed Countries
  const countriesData = Array.from({ length: 50 }, () => ({
    country_name: faker.location.country(),
    country_code: faker.location.countryCode(),
    region: faker.location.state(),
  }));

  await prisma.countries.createMany({
    data: countriesData,
  });

  console.log("Seeded countries.");

  // Seed Users with currency (using enum for currency)
  const usersData = Array.from({ length: 500 }, () => ({
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password_hash: faker.internet.password(),
    date_of_birth: faker.date.birthdate({ min: 18, max: 60, mode: "age" }),
    country_id: faker.number.int({ min: 1, max: 5 }),
    balance: parseFloat(faker.finance.amount()),
    currency: faker.helpers.arrayElement(["USD", "EUR", "GBP", "JPY"]),
    creation_date: faker.date.past(),
  }));

  await prisma.users.createMany({
    data: usersData,
  });

  console.log("Seeded users.");

  // Seed Publishers
  const publishersData = Array.from({ length: 30 }, () => ({
    name: faker.company.name(),
    country_id: faker.number.int({ min: 1, max: 5 }),
    description: faker.company.catchPhrase(),
    website_url: faker.internet.url(),
  }));

  await prisma.publishers.createMany({
    data: publishersData,
  });

  console.log("Seeded publishers.");

  // Seed Creators
  const creatorsData = Array.from({ length: 30 }, () => ({
    name: faker.company.name(),
    country_id: faker.number.int({ min: 1, max: 5 }),
    founded_date: faker.date.past(),
    description: faker.lorem.sentences(10),
    website_url: faker.internet.url(),
  }));

  await prisma.creators.createMany({
    data: creatorsData,
  });

  console.log("Seeded creators.");

  // Seed Games with creator_id
  const gamesData = Array.from({ length: 80 }, () => ({
    title: faker.lorem.words(3),
    description: faker.lorem.sentences(2),
    genre: faker.helpers.arrayElement(["Action", "Adventure", "Puzzle", "RPG"]),
    publisher_id: faker.number.int({ min: 1, max: 5 }),
    creator_id: faker.number.int({ min: 1, max: 5 }), // Add creator_id field
    price: faker.number.float({ min: 5, max: 60, fractionDigits: 2 }),
    platform: faker.helpers.arrayElement(["PC", "Console", "Mobile"]),
    rating: faker.number.float({ min: 0, max: 5, fractionDigits: 2 }),
  }));

  await prisma.games.createMany({
    data: gamesData,
  });

  console.log("Seeded games.");

  // Seed GameCreators (many-to-many relationship between games and creators)
  const gameCreatorsData = Array.from({ length: 30 }, () => ({
    game_id: faker.number.int({ min: 1, max: 80 }), // Ensure this corresponds with valid game_id
    creator_id: faker.number.int({ min: 1, max: 30 }), // Ensure this corresponds with valid creator_id
  }));

  await prisma.gameCreators.createMany({
    data: gameCreatorsData,
  });

  console.log("Seeded game creators.");

  // Seed Libraries
  const librariesData = Array.from({ length: 500 }, (_, index) => ({
    user_id: index + 1,
  }));

  await prisma.libraries.createMany({
    data: librariesData,
  });

  console.log("Seeded libraries.");

  // Seed LibraryGames
  const libraryGamesData = Array.from({ length: 500 }, () => ({
    library_id: faker.number.int({ min: 1, max: 500 }),
    game_id: faker.number.int({ min: 1, max: 80 }),
    added_date: faker.date.past(),
    play_time: faker.number.float({ min: 0, max: 100, fractionDigits: 3 }),
  }));

  await prisma.libraryGames.createMany({
    data: libraryGamesData,
  });

  console.log("Seeded library games.");

  // Seed Achievements
  const achievementsData = Array.from({ length: 75 }, () => ({
    game_id: faker.number.int({ min: 1, max: 80 }),
    name: faker.lorem.words(2),
    description: faker.lorem.sentence(),
    points: faker.number.int({ min: 10, max: 100 }),
  }));

  await prisma.achievements.createMany({
    data: achievementsData,
  });

  console.log("Seeded achievements.");

  // Seed Tickets (new)
  const ticketsData = Array.from({ length: 100 }, () => ({
    user_id: faker.number.int({ min: 1, max: 500 }),
    subject: faker.lorem.sentence(),
    description: faker.lorem.paragraph(),
    status: faker.helpers.arrayElement(["OPEN", "IN_PROGRESS", "CLOSED", "RESOLVED"]),
    creation_date: faker.date.past(),
  }));

  await prisma.tickets.createMany({
    data: ticketsData,
  });

  console.log("Seeded tickets.");

  // Seed Support Responses (new)
  const supportData = Array.from({ length: 100 }, () => ({
    ticket_id: faker.number.int({ min: 1, max: 100 }),
    responder_id: faker.number.int({ min: 1, max: 50 }),
    response: faker.lorem.paragraph(),
    response_date: faker.date.past(),
  }));

  await prisma.support.createMany({
    data: supportData,
  });

  console.log("Seeded support responses.");

  console.log("Seeding completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
