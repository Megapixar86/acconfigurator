import * as XLSX from 'xlsx';
import './style.css';
import wallmountImg from './static/images/ptz/box/LTV-BMW-JB-U8.2.png';
//import ceilmountImg from './static/images/ceilmount/kronstein-a.jpg';
//import conermountImg from './static/images/conermount/kronstein-a.jpg';
//import polemountImg from './static/images/polemount/kronstein-a.jpg';
//import boxImg from './static/images/box/kronstein-a.jpg';
//import * as dat from 'lil-gui';

// переменные
let accessories;
let sl;
// получить елемент по ID
const el = (id)=> document.getElementById(id)
//выбираем элементы
const es = (selector)=> document.querySelector(selector)
//извлечь значение первого элемента по имени
const enm = (name)=> document.getElementsByName(name)[0]

const url = "http://127.0.0.1:8080/Acc.xlsx"
/*const accessories = [
	{
		id: 1,
		name: "Чехол Premium",
		price: "2 990 ₽",
		image: "https://via.placeholder.com/200x200/667eea/white?text=Premium+Case",
		series: ["premium"],
		caseType: ["metal", "composite"],
		model: ["model-a", "model-b"],
		mountType: ["magnetic"]
	},
	{
		id: 2,
		name: "Крепление Clip Pro",
		price: "1 490 ₽",
		image: "https://via.placeholder.com/200x200/764ba2/white?text=Clip+Pro",
		series: ["standard", "premium"],
		caseType: ["plastic", "composite"],
		model: ["model-b", "model-c"],
		mountType: ["clip"]
	},
	{
		id: 3,
		name: "Адаптер Universal",
		price: "890 ₽",
		image: "https://via.placeholder.com/200x200/4CAF50/white?text=Universal",
		series: ["budget", "standard"],
		caseType: ["plastic"],
		model: ["model-a", "model-c"],
		mountType: ["adhesive"]
	},
	{
		id: 4,
		name: "Магнитное крепление",
		price: "1 790 ₽",
		image: "https://via.placeholder.com/200x200/FF6B6B/white?text=Magnetic",
		series: ["premium"],
		caseType: ["metal"],
		model: ["model-a"],
		mountType: ["magnetic"]
	}
];*/

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
					const imageUrl = accessory.wallmountImage || 'https://via.placeholder.com/150x150/667eea/white?text=Wall+Mount';
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
					const imageUrl = accessory.ceilmountImage || 'https://via.placeholder.com/150x150/4CAF50/white?text=Ceiling+Mount';
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
					const imageUrl = accessory.conermountImage || 'https://via.placeholder.com/150x150/FF9800/white?text=Corner+Mount';
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
					const imageUrl = accessory.polemountImage || 'https://via.placeholder.com/150x150/9C27B0/white?text=Pole+Mount';
					mountOptionsHTML += `
						<div class="accessory-item">
							<div class="accessory-name">Крепление на столб вариант ${index + 1}: ${processedOption}</div>
							<img src="${imageUrl}" alt="Крепление на столб ${index + 1}" class="accessory-image">
						</div>`;
				});
			} else if (!selectedMountType || selectedMountType === 'polemount') {
				mountOptionsHTML += `<div class="accessory-item"><div class="accessory-name">Крепление на столб: Н/Д</div></div>`;
			}
			
			const accessoryElement = `
				<div class="accessory-item">
					<div class="accessory-name">Коробка: ${accessory.box || 'Н/Д'}</div>
					<img src="${wallmountImg}" alt="Коробка" class="accessory-image">
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