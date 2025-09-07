const http = require('http');

// Configuration
const API_BASE = process.env.API_BASE || 'http://localhost:3001';
const ENDPOINTS = [
  '/',
  '/health',
  '/api/bounties',
  '/api/grants',
  '/api/ideas',
  '/api/users'
];

// Simple HTTP request function
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'StackUp-API-Tester/1.0'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.setTimeout(10000, () => {
      req.abort();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Test function
async function testEndpoint(endpoint) {
  const url = `${API_BASE}${endpoint}`;
  console.log(`\n🔍 Testing: ${url}`);
  
  try {
    const response = await makeRequest(url);
    
    if (response.status >= 200 && response.status < 300) {
      console.log(`✅ Status: ${response.status}`);
      
      if (typeof response.data === 'object') {
        console.log(`📊 Response: ${JSON.stringify(response.data, null, 2).substring(0, 200)}${JSON.stringify(response.data, null, 2).length > 200 ? '...' : ''}`);
      } else {
        console.log(`📊 Response: ${response.data.substring(0, 200)}${response.data.length > 200 ? '...' : ''}`);
      }
    } else {
      console.log(`⚠️  Status: ${response.status}`);
      console.log(`📊 Response: ${JSON.stringify(response.data, null, 2)}`);
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

// Main test function
async function runTests() {
  console.log('🚀 StackUp Backend API Test Suite');
  console.log('==================================');
  console.log(`📡 Testing API at: ${API_BASE}`);
  console.log(`⏰ Started at: ${new Date().toISOString()}`);

  // Test all endpoints
  for (const endpoint of ENDPOINTS) {
    await testEndpoint(endpoint);
  }

  console.log('\n🎉 Test suite completed!');
  console.log(`⏰ Finished at: ${new Date().toISOString()}`);
}

// Run tests
runTests().catch(console.error);
