# How to Set Up

This is a full-stack Toy Robot Simulator application with:

- **Backend**: NestJS API with Prisma SQLite database
- **Frontend**: React application with TypeScript and Viteg

## Backend

- cd backend
- npm install
- npm run prisma:generate
- npm run prisma:migrate
- npm run start:dev
- Check the backend at http://localhost:3000

## Frontend

- cd frontend
- npm install
- npm run dev
- Check the backend at http://localhost:5173

## Tests

- cd backend
- npm run test

## Check DB

- cd backend
- npm run prisma:studio
- Check at http://localhost:5555

## Notes

- Arrow keys mimic the buttons
- Needed to mock tests to best test the backend, would have done that if I had more tests
