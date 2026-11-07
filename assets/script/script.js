async function loadCoupons() {
  try {
    const response = await fetch('assets/data/data.json')
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Успех! Данные получены из файла:', data.response.dishes);
    
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

loadCoupons();