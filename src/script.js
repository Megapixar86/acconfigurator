import * as XLSX from 'xlsx';
//import accXlsxUrl from './static/Acc2.xlsx';
import accXlsxUrl from './static/Acc3.xlsx';
import './style.css';
//import wallmountImg from './static/images/ptz/box/LTV-BMW-JB-U8.2.png';
//import ptzboxImg from './static/images/ptzbox.png';
/*import ptzwallmountImg from './static/images/ptzwallmount.png';
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
import bullet2boxImg from './static/images/bullet2box.png';*/
//изображения камер
//const ptzwallmountImg = '/images/ptzwallmount.png'
//const ballwallmountImg = '/images/ballwallmount.png'
//const bulletwallmountImg = '/images/bulletwallmount.png'
//const bullet2wallmountImg = '/images/bullet2wallmount.png'
//const ballceilmountImg = '/images/ballceilmount.png'
//const bulletceilmountImg = '/images/bulletceilmount.png'
//const bullet2ceilmountImg = '/images/bullet2ceilmount.png'
//const ptzceilmountImg = '/images/ptzceilmount.png'
//const ptz2ceilmountImg = '/images/ptz2ceilmount.png'

// переменные
let models;
let acc;
// получить елемент по ID
const el = (id)=> document.getElementById(id)
//выбираем элементы
const es = (selector)=> document.querySelector(selector)
//извлечь значение первого элемента по имени
const enm = (name)=> document.getElementsByName(name)[0]

const url = accXlsxUrl
//const url = "http://127.0.0.1:8080/Acc.xlsx"
//const url = "https://cloud.luis.ru/index.php/s/HnwNpx33TZLEass/download/Acc.xlsx"

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
getData(url, "Models").then(objxlsx => {
    models = objxlsx;
    console.log("Данные загружены:", models);
}).catch(error => {
    console.error("Ошибка при загрузке данных:", error);
});
// Инициализация данных при загрузке страницы
getData(url, "Acc").then(objxlsx => {
    acc = objxlsx;
    console.log("Данные загружены:", acc);
}).catch(error => {
    console.error("Ошибка при загрузке данных:", error);
});

console.log(models)
console.log(acc)

function fillField(nameDiv, selChild){
	let select1
	let select2
	let select3
	console.log(nameDiv)
	if(nameDiv == 'case'){
		select1 = el('series').value
		el('objective').style.display = "none";
		el('modelGroup').style.display = "none";
		el('mount').style.display = "none";
	}
	if(nameDiv == 'objective'){
		select1 = el('series').value
		select2 = el('caseType').value
		el('modelGroup').style.display = "none";
		el('mount').style.display = "none";
	}
	if(nameDiv == 'modelGroup'){
		select1 = el('series').value
		select2 = el('caseType').value
		select3 = el('objectiveType').value
		el('mount').style.display = "block";
	}
	const elDiv = document.getElementById(nameDiv);
	const FField = document.getElementById(selChild);
	// Если не выбран преидущий элемент скрываем поле
	if (!elDiv) {
		elDiv.style.display = 'none';
		return;
	}
	// Показываем поле
	elDiv.style.display = "block";
	const filteredCase = new Set();
	models.forEach(model => {
		if(nameDiv === 'modelGroup'){
			if( model['Series'] == select1 && model['Body'] == select2 && model['Objective'] == select3){
			filteredCase.add(model['Model'].trim());
			}
		}
		if(nameDiv === 'objective'){
			if( model['Series'] == select1 && model['Body'] == select2){
			filteredCase.add(model['Objective'].trim());
			}
		}
		if( nameDiv === 'case'){
			if(model['Series'] == select1){
			filteredCase.add(model['Body'].trim());
			}
		}
	});
	// Очищаем существующие опции, кроме первой (заголовок)
	while (FField.children.length > 1) {
		FField.removeChild(FField.lastChild);
	}
	// Сбрасываем значение на первый элемент
	FField.selectedIndex = 0;
    console.log(filteredCase)
	// Добавляем новые опции
	filteredCase.forEach(b => {
		const option = document.createElement('option');
		option.value = b;
		option.textContent = b;
		FField.appendChild(option);
	});

}

function fillMountField(){
	const select = el('caseType').value
	const filteredMount = new Set();
	acc.forEach(acc => {
		if(acc['Body'] == select){
			filteredMount.add(acc['Typefix'].trim());
		}
	});
	const FField = document.getElementById('mountType');
	while (FField.children.length > 1) {
		FField.removeChild(FField.lastChild);
	}
	FField.selectedIndex = 0;
	filteredMount.forEach(b => {
		const option = document.createElement('option');
		option.value = b;
		option.textContent = b;
		FField.appendChild(option);
	});
	console.log(filteredMount)
}

function findAccessories() {
	// Проверяем, загружены ли данные
	if (!models|| models.length === 0 ||!acc|| acc.length === 0) {
		console.log("Данные еще не загружены");
		return;
	}

	const series = document.getElementById('series').value;
	const caseType = document.getElementById('caseType').value;
	const caseOjective = document.getElementById('objectiveType').value;
	const modelV = document.getElementById('model').value;
	const mountType = document.getElementById('mountType').value;

	// Отладочная информация
	console.log("Выбранные значения:", { series, caseType, caseOjective, modelV, mountType });
	if (acc.length > 0) {
		console.log("Пример структуры данных:", acc[0]);
	}

	// Фильтрация аксессуаров по выбранным параметрам
	const filteredbox = models.filter(model => model.Model == modelV)
	
	if (!filteredbox || filteredbox.length === 0 || !filteredbox[0].Accessories) {
		console.log("Модель не найдена или у неё нет аксессуаров");
		return;
	}
	
	const accessoriesStr = filteredbox[0].Accessories;
	// Если есть запятая, делаем split, иначе возвращаем массив с одним элементом
	const needAcc = accessoriesStr.includes(', ') 
		? accessoriesStr.split(', ').map(item => item.trim()) 
		: [accessoriesStr.trim()];
	console.log('Аксессуары для модели:', needAcc)
	console.log(typeof series)
	const filteredAccessories = acc
		.filter(a => a['Typefix'] === mountType)
		.filter(a => a['Body'] === caseType)
		.filter(a => {
			// Проверяем, что Series существует и является строкой
			if (!a['Series'] || typeof a['Series'] !== 'string') {
				a['Series'] = String(a['Series']);
			}
			const filacc = a['Series'].includes(',')
				? a['Series'].split(', ').map(item => item.trim())
				: [a['Series'].trim()];
			// Проверяем, совпадает ли series хотя бы с одним значением из filacc
			return filacc.includes(series);
		})
		.filter(a => {
			console.log(a['Box'])
			console.log(filteredbox[0].Box)
			/*if(a['Box'] == null || a['Box'] == undefined || a['Box'] == '') {
				return false;
			}
			if(filteredbox[0].Box == null || filteredbox[0].Box == undefined || filteredbox[0].Box == '') {
				return false;
			}*/
			return a['Box'] === filteredbox[0].Box
		})
		.filter(a => {
			// Проверяем, что Fix1 существует
			if (!a['Fix1']) {
				return false;
			}
			// Преобразуем Fix1 в строку, если нужно
			const fix1Str = String(a['Fix1']);
			// Если есть запятая, делаем split, иначе возвращаем массив с одним элементом
			const fix1Array = fix1Str.includes(',')
				? fix1Str.split(',').map(item => item.trim())
				: [fix1Str.trim()];
			// Проверяем, что хотя бы одно значение из needAcc присутствует в fix1Array
			//return needAcc.some(acc => fix1Array.includes(acc));
			// Находим первое значение из needAcc, которое присутствует в fix1Array
			const matchingAcc = needAcc.find(acc => fix1Array.includes(acc));
			// Если найдено совпадение, заменяем значение Fix1
			if (matchingAcc) {
				a['Fix1'] = matchingAcc;
				return true;
			}
			return false;
		})
	console.log(filteredAccessories)
	// Заменяем 'cam' на modelV в filteredAccessories
	filteredAccessories.forEach(accessory => {
		Object.keys(accessory).forEach(key => {
			if (typeof accessory[key] === 'string' && accessory[key].includes('cam')) {
				accessory[key] = accessory[key].replace(/cam/g, modelV);
			}
		});
	});
	
	console.log(filteredAccessories)

	//const filteredAccessories = accessories.filter(accessory => accessory.model === model)
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
			
			/* Функция для разбиения текста на варианты
			function splitOptions(text) {
				if (!text || text === 'Н/Д') return ['Н/Д'];
				return text.split('/').map(item => item.trim()).filter(item => item !== '');
			}
			
			// Функция для обработки звездочки в тексте
			function processStarText(text, boxValue) {
				if (!text || text === 'Н/Д') return 'Н/Д';
				// Заменяем звездочку на значение коробки и добавляем плюс
				return text.replace(/\*///g, boxValue + ' +');
			//} 
			
			// Разбиваем варианты крепления
			/*const wallmountOptions = splitOptions(accessory.wallmount);
			const ceilmountOptions = splitOptions(accessory.ceilmount);
			const conermountOptions = splitOptions(accessory.conermount);
			const polemountOptions = splitOptions(accessory.polemount);
			
			// Получаем выбранный тип крепления
			//const selectedMountType = document.getElementById('mountType').value;
			*/
			// Создаем HTML для каждого варианта крепления
			let mountOptionsHTML = '';
			if (accessory.Fix1 != null && String(accessory.Fix1).trim() !== '') {
				// Fix1 есть и не пустой
				mountOptionsHTML += `
						<div class="accessory-item">
							<div class="accessory-name">${accessory.Fix1}</div>`;
			}
			
			if (accessory.Fix2 != null && String(accessory.Fix2).trim() !== '') {
				// Fix2 есть и не пустой
				mountOptionsHTML += `<div class="accessory-name">${accessory.Fix2}</div>`;
			}
			
			if (accessory.Fix3 != null && String(accessory.Fix3).trim() !== '') {
				// Fix3 есть и не пустой
				mountOptionsHTML += `<div class="accessory-name">${accessory.Fix3}</div>`;
			}
			if (accessory.Pic != null && String(accessory.Pic).trim() !== '') {
				mountOptionsHTML += `<img src="/images2/${accessory.Pic}.png" class="accessory-image"></div>`;
			} else {
				mountOptionsHTML += `</div>`;
			}
			/*
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
			// Проверяем есть ли ссылка для коробки
			const boxLink = accessory.box_url ? `<a href="${accessory.box_url}" target="_blank" class="accessory-link">Скачать</a>` : '';
			
			const accessoryElement = `
				<div class="accessory-item">
					<div class="accessory-name">Коробка: ${accessory.box || 'Н/Д'}</div>
					<img src="${boxImg}" alt="Коробка" class="accessory-image">
					${boxLink}
				</div>
				${mountOptionsHTML}
			`;*/
			//gridDiv.innerHTML += accessoryElement;
			gridDiv.innerHTML += mountOptionsHTML;
		});
	}

	resultsDiv.classList.add('show');
	//el("model_speker").style.display = "table-row";
	
	// Прокрутка к результатам
	resultsDiv.scrollIntoView({ behavior: 'smooth' });
}

window.onload = onLoadHandler;
function onLoadHandler() {

	el("series").addEventListener('change', function() {
		fillField('case', 'caseType');
		document.getElementById('accessoryGrid').innerHTML = '';
		//el('results').style.display = 'none';
	});

	el("caseType").addEventListener('change', function() {
		fillField('objective', 'objectiveType');
		document.getElementById('accessoryGrid').innerHTML = '';
		//el('results').style.display = 'none';
	});

	el("objectiveType").addEventListener('change', function() {
		fillField('modelGroup', 'model');
		document.getElementById('accessoryGrid').innerHTML = '';
		//el('results').style.display = 'none';
	});

	el("model").addEventListener('change', function() {
		el('mountType').selectedIndex = 0;
		fillMountField();
		document.getElementById('accessoryGrid').innerHTML = '';
		//el('results').style.display = 'none';
	});

	el("mountType").addEventListener('change', function() {
		findAccessories();
	});
}