from app.core.security import hash_password, verify_password

# Test password from seed
test_password = "patient123"
hashed = hash_password(test_password)
print(f"Hashed: {hashed}")
print(f"Verify: {verify_password(test_password, hashed)}")

# Test with a hash from your database
# Copy the hashed_password from john.doe@example.com row
db_hash = "$2b$12$JH.REuWrkbQQURDfcIbvF.W1JKwPcDu/HIo1R3HJhBk/3LK9SnuUS"
print(f"Verify DB hash: {verify_password('patient123', db_hash)}")