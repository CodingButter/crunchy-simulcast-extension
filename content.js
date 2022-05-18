;(() => {
  const SERVER_URL = "https://beastcraft.codingbutter.com:3200/"
  var detailsElement
  const getSeriesName = (location) => {
    const split = location.split("/")
    const seriesname = split[5]
    if (!seriesname) return false
    return seriesname
  }
  //Fetch Data From root site
  const fetchDate = async (location) => {
    const title = getSeriesName(location)
    if (!title) return
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    })
    return await response.json()
  }
  const getMoreDetailsElement = async (location) =>
    new Promise((resolve, reject) => {
      var i = 0
      const elementInterval = setInterval(() => {
        const detailsElement = document.querySelector(".erc-show-description")
        if (detailsElement) {
          clearInterval(elementInterval)
          resolve(detailsElement)
          return
        }
        if (++i >= 100) {
          reject(false)
        }
      }, [100])
    })

  const injectSimulCastDate = async (location) => {
    const blurredImage = document.querySelector(`[alt="Series background blurred"]`).cloneNode(true)
    const simulcastText = document.createElement("p")
    simulcastText.innerText = "Fetching Simulcast"
    detailsElement = await getMoreDetailsElement()
    if (!detailsElement) {
      console.log("no element found")
      return
    }
    const simulElement =
      detailsElement.querySelector("#simulcastdate") || document.createElement("div")
    simulElement.id = "simulcastdate"
    simulElement.innerHTML = ""
    simulElement.append(blurredImage)
    simulElement.append(simulcastText)
    if (!detailsElement.querySelector("#simulcastdate")) {
      detailsElement.prepend(simulElement)
    }
    const { simulcast } = await fetchDate(location)
    simulcastText.innerText = simulcast
  }

  var oldHref = document.location.href

  window.onload = function () {
    var bodyList = document.querySelector("body")

    var observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (oldHref != document.location.href) {
          oldHref = document.location.href
          injectSimulCastDate(document.location.href)
        }
      })
    })

    var config = {
      childList: true,
      subtree: true,
    }

    observer.observe(bodyList, config)
  }
  if (!detailsElement) injectSimulCastDate(document.location.href)
})()
