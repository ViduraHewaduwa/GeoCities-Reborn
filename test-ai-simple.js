/**
 * Simple AI Code Generator Test
 * Tests AI endpoints and measures generation time
 * Run with: node test-ai-simple.js
 */

const http = require('http');

const BASE_URL = 'localhost';
const PORT = 3000;

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Helper to make HTTP requests
function makeRequest(path, data) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: BASE_URL,
      port: PORT,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          resolve({ status: res.statusCode, data });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Test function with timing
async function runTest(name, path, payload, validator) {
  console.log(`\n🧪 Testing: ${name}`);
  const startTime = Date.now();
  
  try {
    const response = await makeRequest(path, payload);
    const duration = Date.now() - startTime;
    
    const isValid = validator(response);
    
    if (isValid) {
      results.passed++;
      console.log(`  ✅ PASS (${duration}ms)`);
      console.log(`  Response: ${JSON.stringify(response.data).substring(0, 100)}...`);
    } else {
      results.failed++;
      console.log(`  ❌ FAIL (${duration}ms)`);
      console.log(`  Response: ${JSON.stringify(response.data)}`);
    }
    
    results.tests.push({ name, status: isValid ? 'PASS' : 'FAIL', duration });
    
  } catch (error) {
    const duration = Date.now() - startTime;
    results.failed++;
    console.log(`  ❌ ERROR (${duration}ms)`);
    console.log(`  Error: ${error.message}`);
    results.tests.push({ name, status: 'ERROR', duration, error: error.message });
  }
}

// Main test suite
async function runTests() {
  console.log('🚀 AI Code Generator Test Suite');
  console.log('================================\n');
  
  // Test 1: Generate HTML code
  await runTest(
    'Generate HTML Code',
    '/api/ai/generate',
    {
      prompt: 'Create a simple hello world HTML page',
      codeContext: '',
      language: 'html',
      theme: 'default'
    },
    (res) => res.status === 200 && res.data.code && res.data.code.length > 0
  );

  // Test 2: Generate with context
  await runTest(
    'Generate with Context',
    '/api/ai/generate',
    {
      prompt: 'Add a rainbow gradient background',
      codeContext: '<html><body><h1>Hello</h1></body></html>',
      language: 'html',
      theme: 'cyber'
    },
    (res) => res.status === 200 && res.data.code && res.data.code.length > 0
  );

  // Test 3: Generate website
  await runTest(
    'Generate Complete Website',
    '/api/ai/generate-website',
    {
      description: 'A fan page about 90s cartoons',
      theme: 'default'
    },
    (res) => res.status === 200 && res.data.html && res.data.html.length > 0
  );

  // Test 4: Improve code
  await runTest(
    'Improve Code',
    '/api/ai/improve',
    {
      code: '<html><body><h1>Hello</h1></body></html>',
      instruction: 'Add proper DOCTYPE and meta tags',
      language: 'html'
    },
    (res) => res.status === 200 && res.data.code && res.data.code.length > 0
  );

  // Test 5: Explain code
  await runTest(
    'Explain Code',
    '/api/ai/explain',
    {
      code: '<marquee>Hello World</marquee>',
      language: 'html'
    },
    (res) => res.status === 200 && res.data.explanation && res.data.explanation.length > 0
  );

  // Test 6: Fix code
  await runTest(
    'Fix Code Errors',
    '/api/ai/fix',
    {
      code: '<html><body><h1>Hello</body></html>',
      language: 'html'
    },
    (res) => res.status === 200 && res.data.code && res.data.code.length > 0
  );

  // Test 7: Error handling - missing prompt
  await runTest(
    'Error Handling: Missing Prompt',
    '/api/ai/generate',
    {
      codeContext: '',
      language: 'html'
    },
    (res) => res.status === 400 && res.data.error
  );

  // Test 8: Error handling - missing description
  await runTest(
    'Error Handling: Missing Description',
    '/api/ai/generate-website',
    {
      theme: 'default'
    },
    (res) => res.status === 400 && res.data.error
  );

  // Generate report
  console.log('\n\n📊 TEST REPORT');
  console.log('================================');
  console.log(`Total Tests: ${results.passed + results.failed}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(2)}%`);
  
  console.log('\n⏱️  Generation Times:');
  results.tests.forEach(test => {
    const icon = test.status === 'PASS' ? '✅' : '❌';
    console.log(`  ${icon} ${test.name}: ${test.duration}ms`);
  });
  
  const avgTime = results.tests.reduce((sum, t) => sum + t.duration, 0) / results.tests.length;
  console.log(`\n📈 Average Generation Time: ${avgTime.toFixed(2)}ms`);
  
  console.log('\n================================\n');
  
  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run the tests
runTests().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
