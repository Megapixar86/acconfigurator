import * as XLSX from 'xlsx';
import accXlsxUrl from './static/Acc.xlsx';
import './style.css';
//import wallmountImg from './static/images/ptz/box/LTV-BMW-JB-U8.2.png';
//import ptzboxImg from './static/images/ptzbox.png';
import ptzwallmountImg from './static/images/ptzwallmount.png';
import ptz2wallmountImg from './static/images/ptz2wallmount.png';
import ballwallmountImg from './static/images/ballwallmount.png';
import bulletwallmountImg from './static/images/bulletwallmount.png';
import bullet2wallmountImg from './static/images/bullet2wallmount.png';
import ballceilmountImg from './static/images/ballceilmount.png';
import bulletceilmountImg from './static/images/bulletceilmount.png';
import bullet2ceilmountImg from './static/images/bullet2ceilmount.png';
import ptzceilmountImg from './static/images/ptzceilmount.png';
//import ptzceilmountImg2 from './static/images/ptzceilmount2.png';
import ptz2ceilmountImg from './static/images/ptz2ceilmount.png';
//import ptz2ceilmountImg2 from './static/images/ptz2ceilmount2.png';
import ptzconermountImg from './static/images/ptzconermount.png';
import ptz2conermountImg from './static/images/ptz2conermount.png';
import ballconermountImg from './static/images/ballconermount.png';
import bulletconermountImg from './static/images/bulletconermount.png';
import bullet2conermountImg from './static/images/bullet2conermount.png';
import ballboxImg from './static/images/ballbox.png';
import ptzboxImg from './static/images/ptzbox.png';
import ptz2boxImg from './static/images/ptz2box.png';
import bulletboxImg from './static/images/bulletbox.png';
import bullet2boxImg from './static/images/bullet2box.png';

// переменные
let accessories;
let sl;
// получить елемент по ID
const el = (id)=> document.getElementById(id)
//выбираем элементы
const es = (selector)=> document.querySelector(selector)
//извлечь значение первого элемента по имени
const enm = (name)=> document.getElementsByName(name)[0]

const url = accXlsxUrl
//const url = "https://cloud.luis.ru/index.php/f/538620/download/Acc.xlsx"

async function getData(address, sht){
	let arr = new Array()
	const f = await function StrToArr (bufArr){
		for (let i = 0; i != bufArr.length; ++i) {
			arr[i] = String.fromCharCode(bufArr[i]);
		};
		return arr.join("")
		
	};
	const data = await fetch(address);
	const buf = await data.arrayBuffer();
	const bufArr = await new Uint8Array(buf);
	let str = await f(bufArr)
	const xls = await XLSX.read(str, { type: 'binary' });
	//console.log(xls)
	const json = await XLSX.utils.sheet_to_json(xls.Sheets[sht]);
	//console.log(json)
	return json
}

// Инициализация данных при загрузке страницы
getData(url, "series").then(objxlsx => {
    accessories = objxlsx;
    console.log("Данные загружены:", accessories);
    // Заполняем select элементы данными
    datafill();
    // Инициализируем фильтрацию после загрузки данных
    // findAccessories();
}).catch(error => {
    console.error("Ошибка при загрузке данных:", error);
});

function datafill(){
	// Проверяем, загружены ли данные
	if (!accessories || accessories.length === 0) {
		console.log("Данные еще не загружены для заполнения select");
		return;
	}

	// Функция для заполнения моделей в зависимости от выбранного типа корпуса
	fillModelsByCaseType();
}

function fillModelsByCaseType() {
	const selectedCaseType = document.getElementById('caseType').options[el('caseType').selectedIndex].value;
	console.log(selectedCaseType)
	const modelGroup = document.getElementById('modelGroup');
	const modelSelect = document.getElementById('model');
	
	// Если тип корпуса не выбран, скрываем поле модели
	if (!selectedCaseType) {
		modelGroup.style.display = 'none';
		return;
	}

	// Показываем поле модели
	modelGroup.style.display = 'block';

	// Получаем модели только для выбранного типа корпуса
	const filteredModels = new Set();
	accessories.forEach(accessory => {
		console.log(accessory.type)
		if (accessory.type === selectedCaseType && accessory.model) {
			filteredModels.add(accessory.model.trim());
		}
	});

	// Очищаем существующие опции, кроме первой (заголовок)
	while (modelSelect.children.length > 1) {
		modelSelect.removeChild(modelSelect.lastChild);
	}

	// Сбрасываем значение на первый элемент
	modelSelect.selectedIndex = 0;

	// Добавляем новые опции
	console.log(`Модели для типа корпуса "${selectedCaseType}":`, filteredModels);
	filteredModels.forEach(model => {
		const option = document.createElement('option');
		option.value = model;
		option.textContent = model;
		modelSelect.appendChild(option);
	});

	console.log(`Заполнено ${filteredModels.size} моделей для типа корпуса "${selectedCaseType}"`);
}

function findAccessories() {
	// Проверяем, загружены ли данные
	if (!accessories || accessories.length === 0) {
		console.log("Данные еще не загружены");
		return;
	}

	const series = document.getElementById('series').value;
	const caseType = document.getElementById('caseType').value;
	const model = document.getElementById('model').value;
	const mountType = document.getElementById('mountType').value;

	// Отладочная информация
	console.log("Выбранные значения:", { series, caseType, model, mountType });
	if (accessories.length > 0) {
		console.log("Пример структуры данных:", accessories[0]);
	}

	// Фильтрация аксессуаров по выбранным параметрам
	const filteredAccessories = accessories.filter(accessory => accessory.model === model)
	displayResults(filteredAccessories);
}

function displayResults(accessoriesList) {
	const resultsDiv = document.getElementById('results');
	const gridDiv = document.getElementById('accessoryGrid');
	
	gridDiv.innerHTML = '';
	console.log(accessoriesList)
	if (accessoriesList.length === 0) {
		console.log(accessoriesList)
		gridDiv.innerHTML = '<div class="no-results">По вашему запросу ничего не найдено</div>';
	} else {
		// Перебираем каждый объект в массиве
		accessoriesList.forEach(accessory => {
			console.log("Обрабатываем объект:", accessory);
			
			// Функция для разбиения текста на варианты
			function splitOptions(text) {
				if (!text || text === 'Н/Д') return ['Н/Д'];
				return text.split('/').map(item => item.trim()).filter(item => item !== '');
			}
			
			// Функция для обработки звездочки в тексте
			function processStarText(text, boxValue) {
				if (!text || text === 'Н/Д') return 'Н/Д';
				// Заменяем звездочку на значение коробки и добавляем плюс
				return text.replace(/\*/g, boxValue + ' +');
			}
			
			// Разбиваем варианты крепления
			const wallmountOptions = splitOptions(accessory.wallmount);
			const ceilmountOptions = splitOptions(accessory.ceilmount);
			const conermountOptions = splitOptions(accessory.conermount);
			const polemountOptions = splitOptions(accessory.polemount);
			
			// Получаем выбранный тип крепления
			const selectedMountType = document.getElementById('mountType').value;
			
			// Создаем HTML для каждого варианта крепления
			let mountOptionsHTML = '';
			
			// Крепление на стену (показываем только если выбран или ничего не выбрано)
			if ((!selectedMountType || selectedMountType === 'wallmount') && wallmountOptions.length > 0 && wallmountOptions[0] !== 'Н/Д') {
				wallmountOptions.forEach((option, index) => {
					const processedOption = processStarText(option, accessory.box);
					let imageUrl;
					switch (accessory.box) {
						case 'LTV-BMW-JB-U8':
						case 'LTV-BMW-JB-U3':
							if (accessory.type === 'PTZ') {
								imageUrl = ptzwallmountImg;
							} else if (accessory.type === 'dome' || accessory.type === 'ball') {
								imageUrl = ballwallmountImg;
							} else {
								imageUrl = 'https://via.placeholder.com/150x150/667eea/white?text=Wall+Mount';
							}
							break;
						case 'LTV-BMW-JB-U5':
							imageUrl = bulletwallmountImg;
							break;
						case 'LTV-BMW-JB-U4':
							imageUrl = bullet2wallmountImg;
							break;
						case '-':
							imageUrl = ptz2wallmountImg;
							break;
						default:
							imageUrl = 'https://via.placeholder.com/150x150/667eea/white?text=Wall+Mount';
							break;
					}
					mountOptionsHTML += `
						<div class="accessory-item">
							<div class="accessory-name">Крепление на стену вариант ${index + 1}: ${processedOption}</div>
							<img src="${imageUrl}" alt="Крепление на стену ${index + 1}" class="accessory-image">
						</div>`;
				});
			} else if (!selectedMountType || selectedMountType === 'wallmount') {
				mountOptionsHTML += `<div class="accessory-item"><div class="accessory-name">Крепление на стену: Н/Д</div></div>`;
			}
			
			// Крепление на потолок (показываем только если выбран или ничего не выбрано)
			if ((!selectedMountType || selectedMountType === 'ceilmount') && ceilmountOptions.length > 0 && ceilmountOptions[0] !== 'Н/Д') {
				ceilmountOptions.forEach((option, index) => {
					const processedOption = processStarText(option, accessory.box);
					let imageUrl;
					switch (accessory.box) {
						case 'LTV-BMW-JB-U8':
						case 'LTV-BMW-JB-U3':
							if (accessory.type === 'PTZ') {
								imageUrl = ptzceilmountImg;
							} else if (accessory.type === 'dome' || accessory.type === 'ball') {
								imageUrl = ballceilmountImg;
							} else {
								imageUrl = 'https://via.placeholder.com/150x150/667eea/white?text=Wall+Mount';
							}
							break;
						case 'LTV-BMW-JB-U5':
							imageUrl = bulletceilmountImg;
							break;
						case 'LTV-BMW-JB-U4':
							imageUrl = bullet2ceilmountImg;
							break;
						case '-':
							imageUrl = ptz2ceilmountImg;
							break;
						default:
							imageUrl = 'https://via.placeholder.com/150x150/667eea/white?text=Wall+Mount';
							break;
					}
					mountOptionsHTML += `
						<div class="accessory-item">
							<div class="accessory-name">Крепление на потолок вариант ${index + 1}: ${processedOption}</div>
							<img src="${imageUrl}" alt="Крепление на потолок ${index + 1}" class="accessory-image">
						</div>`;
				});
			} else if (!selectedMountType || selectedMountType === 'ceilmount') {
				mountOptionsHTML += `<div class="accessory-item"><div class="accessory-name">Крепление на потолок: Н/Д</div></div>`;
			}
			
			// Крепление на угол (показываем только если выбран или ничего не выбрано)
			if ((!selectedMountType || selectedMountType === 'conermount') && conermountOptions.length > 0 && conermountOptions[0] !== 'Н/Д') {
				conermountOptions.forEach((option, index) => {
					const processedOption = processStarText(option, accessory.box);
					let imageUrl;
					switch (accessory.box) {
						case 'LTV-BMW-JB-U8':
						case 'LTV-BMW-JB-U3':
							if (accessory.type === 'PTZ') {
								imageUrl = ptzconermountImg;
							} else if (accessory.type === 'dome' || accessory.type === 'ball') {
								imageUrl = ballconermountImg;
							} else {
								imageUrl = 'https://via.placeholder.com/150x150/667eea/white?text=Wall+Mount';
							}
							break;
						case 'LTV-BMW-JB-U5':
							imageUrl = bulletconermountImg;
							break;
						case 'LTV-BMW-JB-U4':
							imageUrl = bullet2conermountImg;
							break;
						case '-':
							imageUrl = ptz2conermountImg;
							break;
						default:
							imageUrl = 'https://via.placeholder.com/150x150/667eea/white?text=Wall+Mount';
							break;
					}
					mountOptionsHTML += `
						<div class="accessory-item">
							<div class="accessory-name">Крепление на угол вариант ${index + 1}: ${processedOption}</div>
							<img src="${imageUrl}" alt="Крепление на угол ${index + 1}" class="accessory-image">
						</div>`;
				});
			} else if (!selectedMountType || selectedMountType === 'conermount') {
				mountOptionsHTML += `<div class="accessory-item"><div class="accessory-name">Крепление на угол: Н/Д</div></div>`;
			}
			
			// Крепление на столб (показываем только если выбран или ничего не выбрано)
			if ((!selectedMountType || selectedMountType === 'polemount') && polemountOptions.length > 0 && polemountOptions[0] !== 'Н/Д') {
				polemountOptions.forEach((option, index) => {
					const processedOption = processStarText(option, accessory.box);
					//const imageUrl = accessory.polemountImage || 'https://via.placeholder.com/150x150/9C27B0/white?text=Pole+Mount';
					let imageUrl;
					switch (accessory.box) {
						case 'LTV-BMW-JB-U8':
						case 'LTV-BMW-JB-U3':
							if (accessory.type === 'PTZ') {
								imageUrl = ptzconermountImg;
							} else if (accessory.type === 'dome' || accessory.type === 'ball') {
								imageUrl = ballconermountImg;
							} else {
								imageUrl = 'https://via.placeholder.com/150x150/667eea/white?text=Wall+Mount';
							}
							break;
						case 'LTV-BMW-JB-U5':
							imageUrl = bulletconermountImg;
							break;
						case 'LTV-BMW-JB-U4':
							imageUrl = bullet2conermountImg;
							break;
						case '-':
							imageUrl = ptz2conermountImg;
							break;
						default:
							imageUrl = 'https://via.placeholder.com/150x150/667eea/white?text=Wall+Mount';
							break;
					}
					mountOptionsHTML += `
						<div class="accessory-item">
							<div class="accessory-name">Крепление на столб вариант ${index + 1}: ${processedOption}</div>
							<img src="${imageUrl}" alt="Крепление на столб ${index + 1}" class="accessory-image">
						</div>`;
				});
			} else if (!selectedMountType || selectedMountType === 'polemount') {
				mountOptionsHTML += `<div class="accessory-item"><div class="accessory-name">Крепление на столб: Н/Д</div></div>`;
			}
			let boxImg;
			switch (accessory.box) {
				case 'LTV-BMW-JB-U8':
				case 'LTV-BMW-JB-U3':
					if (accessory.type === 'PTZ') {
						boxImg = ptzboxImg;
					} else if (accessory.type === 'dome' || accessory.type === 'ball') {
						boxImg = ballboxImg;
					} else {
						boxImg = 'https://via.placeholder.com/150x150/667eea/white?text=Wall+Mount';
					}
					break;
				case 'LTV-BMW-JB-U5':
					boxImg = bulletboxImg;
					break;
				case 'LTV-BMW-JB-U4':
					boxImg = bullet2boxImg;
					break;
				case '-':
					boxImg = ptz2boxImg;
					break;
				default:
					boxImg = 'https://via.placeholder.com/150x150/667eea/white?text=Wall+Mount';
					break;
			}
			const accessoryElement = `
				<div class="accessory-item">
					<div class="accessory-name">Коробка: ${accessory.box || 'Н/Д'}</div>
					<img src="${boxImg}" alt="Коробка" class="accessory-image">
				</div>
				${mountOptionsHTML}
			`;
			gridDiv.innerHTML += accessoryElement;
		});
	}

	resultsDiv.classList.add('show');
	
	// Прокрутка к результатам
	resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

// Добавляем обработчики изменений для мгновенного обновления
document.querySelectorAll('select').forEach(select => {
	select.addEventListener('change', function() {
		// Если изменился тип корпуса, обновляем список моделей
		if (this.id === 'caseType') {
			fillModelsByCaseType();
		}
		// При изменении любого select сразу обновляем результаты
		findAccessories();
	});
});