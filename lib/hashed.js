import bcrypt from "bcryptjs";

const password = "rockstar101"; // Your plain text password
const saltRounds = 10; // Number of salt rounds

bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    console.log("Hashed Password:", hashedPassword);
  }
});
