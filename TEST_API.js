// Simple API test - paste into browser console or run with curl

// Test 1: Check if backend is running
fetch('http://localhost:5000/api/health')
  .then(r => r.json())
  .then(data => console.log('✅ Backend health:', data))
  .catch(e => console.log('❌ Backend error:', e.message));

// Test 2: Try to login with student credentials
const loginTest = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'student@demo.com',
        password: 'password123'
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('Token:', data.token.substring(0, 50) + '...');
      console.log('User:', data.student);
    } else {
      console.log('❌ Login failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
};

loginTest();
