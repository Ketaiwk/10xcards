import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

async function testAuth() {
  try {
    console.log('🧪 Rozpoczynam testy autentykacji...\n');

    // Test 1: Próba dostępu do chronionej ścieżki bez logowania
    console.log('Test 1: Dostęp do /sets bez logowania');
    try {
      await axios.get(`${BASE_URL}/sets`);
      console.log('❌ Test 1 nie powiódł się: brak przekierowania do logowania');
    } catch (error: any) {
      if (error.response?.status === 302 && error.response.headers.location?.includes('/auth/login')) {
        console.log('✅ Test 1 zaliczony: przekierowanie do logowania');
      } else {
        console.log('❌ Test 1 nie powiódł się:', error.message);
      }
    }

    // Test 2: Logowanie z błędnymi danymi
    console.log('\nTest 2: Logowanie z błędnymi danymi');
    try {
      await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'test@example.com',
        password: 'wrongpassword'
      });
      console.log('❌ Test 2 nie powiódł się: brak błędu logowania');
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.log('✅ Test 2 zaliczony: otrzymano błąd 401');
      } else {
        console.log('❌ Test 2 nie powiódł się:', error.message);
      }
    }

    // Test 3: Logowanie z poprawnymi danymi
    console.log('\nTest 3: Logowanie z poprawnymi danymi');
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: 'test@example.com',
        password: 'password123'
      });
      
      if (response.status === 200 && response.data.user) {
        console.log('✅ Test 3 zaliczony: poprawne logowanie');
        
        // Zapisz cookie do użycia w kolejnych testach
        const cookies = response.headers['set-cookie'];
        
        // Test 4: Dostęp do chronionej ścieżki po zalogowaniu
        console.log('\nTest 4: Dostęp do /sets po zalogowaniu');
        try {
          const protectedResponse = await axios.get(`${BASE_URL}/sets`, {
            headers: {
              Cookie: cookies?.join('; ')
            }
          });
          
          if (protectedResponse.status === 200) {
            console.log('✅ Test 4 zaliczony: dostęp do chronionej ścieżki');
          }
        } catch (error: any) {
          console.log('❌ Test 4 nie powiódł się:', error.message);
        }
      }
    } catch (error: any) {
      console.log('❌ Test 3 nie powiódł się:', error.message);
    }

  } catch (error) {
    console.error('❌ Błąd podczas testów:', error);
  }
}

// Uruchom testy
testAuth();
