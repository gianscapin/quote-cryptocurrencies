const cryptoSelect = document.getElementById('criptomonedas');
const form = document.getElementById('formulario')
const currency = document.getElementById('moneda');
const resultDiv = document.getElementById('resultado')

const getCrypt = cryptoCurrencies => new Promise( resolve => {
    resolve(cryptoCurrencies)
})

const objFinder = {
    currency:'',
    crypto:''
}

document.addEventListener('DOMContentLoaded', ()=>{
    consultCrypt()
    currency.addEventListener('change', readCurrency)
    cryptoSelect.addEventListener('change', readCrypto)
    form.addEventListener('submit', calculatePrice)

})

function consultCrypt(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'

    fetch(url)
        .then(answer => answer.json())
        .then(result => getCrypt(result.Data))
        .then( crypto => selectCryptoCurrencies(crypto))
}

function selectCryptoCurrencies(cryptoCurrencies){
    cryptoCurrencies.forEach(cryptoCurrency =>{
        const{Name,FullName} = cryptoCurrency.CoinInfo;

        const option = document.createElement('option')
        option.value = Name;
        option.textContent = FullName;
        cryptoSelect.appendChild(option)
    })
}

function readCurrency(e){
    objFinder.currency = e.target.value;
    console.log(objFinder);
}

function readCrypto(e){
    objFinder.crypto = e.target.value;
    console.log(objFinder);
}

function calculatePrice(e){
    e.preventDefault();
    if(objFinder.currency == '' || objFinder.crypto == ''){
        showAlert('Ambos campos son obligatorios.')
        return
    }

    consultAPI()



}

function showAlert(message){

    const errorExist = document.querySelector('.error');

    if(!errorExist){
        const divMessage = document.createElement('div');

        divMessage.classList.add('error');

        divMessage.textContent = message;

        form.appendChild(divMessage);

        setTimeout(()=>{
            divMessage.remove()
        },3000)
    }
}

function consultAPI(){
    const {currency,crypto} = objFinder;
    showSpinner()
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${crypto}&tsyms=${currency}`;

    fetch(url)
        .then(answer => answer.json())
        .then(result => {
            showData(result.DISPLAY[crypto][currency])
        })
}

function showData(data){
    console.log(data)
    const {CHANGEDAY,HIGHDAY,LOWDAY,OPENDAY,PRICE, LASTUPDATE} = data;

    clearHTML()

    const price = document.createElement('div');
    price.innerHTML = `
    <p class="precio">El precio es de: <span>${PRICE}</span></p>
    <p>El valor más alto del día fue de: ${HIGHDAY}</P>
    <p>El valor más bajo del día fue de: ${LOWDAY}</p>
    <p>El precio de entrada de hoy: ${OPENDAY}</p>
    <p>Cambio respecto al día anterior: ${CHANGEDAY}</p>
    <p>Última actualización: <span class='font-bold'>${LASTUPDATE}</span></p>
    `;

    resultDiv.appendChild(price);

}

function clearHTML(){
    while(resultDiv.firstChild){
        resultDiv.removeChild(resultDiv.firstChild)
    }
}
function showSpinner(){
    clearHTML();

    const spinner = document.createElement('div')
    spinner.classList.add('spinner')

    spinner.innerHTML =`
    <div class="double-bounce1"></div>
    <div class="double-bounce2"></div>
    `;

    resultDiv.appendChild(spinner)
}