document.querySelector('#getDigimon').addEventListener('click', getDigimon)
let digiChoice = document.querySelector('#chooseDigimon')
let digiName = document.querySelector('#requestedDigiName')
let digiImage = document.querySelector('#requestedDigiImage')
let digiData = document.querySelector('#requestedDigiData')

function getDigimon() {
  const choice = digiChoice.value.toLowerCase()

  if (choice) {
    const url = `https://digimon-api.vercel.app/api/digimon/name/${choice}`
    const tcg_url = `https://digimoncard.io/api-public/search.php?n=${choice}`

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!data.ErrorMsg) {
          let img = data[0].img
          digiImage.src = img
        } else {
          digiImage.src = "about:blank"
        }
      })
      .catch(err => {
        console.log(`error ${err}`)
      });

    fetch(tcg_url)
      .then(res => res.json())
      .then(data => {
        if (data.length > 0) {
          resultMatchesChoice = false

          do {
            for (let i = 0; i < data.length; i++) {
              if (data[i].type === 'Digimon' || data[i].type === 'Digi-Egg') {
                if (data[i].name.toLowerCase() === choice) {
                  let name = data[i].name

                  if (digiImage.src === 'about:blank') {
                    digiImage.src = data[i].image_url
                  }

                  let level = data[i].stage
                  if (data[i].stage === null) {
                    level = "Unknown"
                  }

                  let attribute = data[i].attribute
                  if (data[i].attribute === null) {
                    attribute = "Unknown"
                  }
                  let type = data[i].digi_type

                  let attrColor = ""
                  let lvlColor = ""
                  let typeColor = ""

                  switch (attribute.toLowerCase()) {
                    case "virus":
                      attrColor = "red"
                      break
                    case "vaccine":
                      attrColor = "darkgreen"
                      break
                    case "data":
                      attrColor = "darkblue"
                      break
                  }

                  switch (level.toLowerCase()) {
                    case "digi-egg":
                    case "baby":
                    case "in-training":
                      lvlColor = "lightskyblue"
                      break
                    case "rookie":
                      lvlColor = "darkgray"
                      break
                    case "champion":
                      lvlColor = "orange"
                      break
                    case "ultimate":
                      lvlColor = "blue"
                      break
                    case "mega":
                      lvlColor = "purple"
                      break
                    default:
                      break
                  }

                  let digi_data = `<span style="color:gold">${name}</span> is a <span style="background-color:${attrColor};color:white">${attribute}</span> type, <span style="background-color:${lvlColor};color:white">${level}</span> level <span style="background-color:${typeColor};color:white">${type}</span> Digimon.`

                  digiName.innerText = name
                  digiData.innerHTML = digi_data
                  resultMatchesChoice = true
                  break
                }
              }

              if (!resultMatchesChoice) {
                digiName.innerHTML = "<span style='color:darkred'>You did not enter the name of a digimon (or the digimon's data does not exist in the APIs)</span>"
                digiImage.src = "img/confused.png"
                digiData.innerText = ''
              }

              resultMatchesChoice = true
            }
          } while (!resultMatchesChoice)
        } else {
          digiName.innerHTML = "<span style='color:darkred'>You did not enter the name of a digimon (or the digimon's data does not exist in the APIs)</span>"
          digiImage.src = "img/confused.png"
          digiData.innerText = ''
        }
      })
      .catch(err => {
        console.log(`error ${err}`)
      });
  }
}