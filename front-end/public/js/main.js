var result;

function renderizaElement(element) {
  return `<div class="col-lg-4 col-md-6 pl-0 mb-3 ">
  <div class="cz-product-item">
      <img
        class="cz-product-item__img mb-4"
        src="/assets/images/default-tv.png"
        alt=""
      />
      <div class='px-3'>
        <h2>${element.title}</h2>
        <div class="cz-product-item__row">
          <span>Marca:</span><span>${element.brand}</span>
        </div>
        <div class="cz-product-item__row">
          <span>Tipo:</span><span>${element.screen_type}</span>
        </div>
        <div class="cz-product-item__row">
          <span>Tamanha:</span><span>${element.screen_size}</span>
        </div>
        <div class="cz-product-item__row">
          <span>Resolução:</span><span>${element.resolution}</span>
        </div>
        <div class="cz-product-item__row">
          <span>Voltagem:</span><span>${element.voltage}</span>
        </div>
        <h2 class="mt-3">Informações adicionais</h2>
        <div class="cz-product-item__row">
          <span>Modelo:</span><span>USZ990055XD</span>
        </div>
        <div class="cz-product-item__row">
          <span>Saídas:</span><span>2 HDMI, 1 USB</span>
        </div>
        <div class="cz-product-item__row mb-4">
          <span>HDTV:</span><span>Sim</span>
        </div>
        <button class="btn btn-danger" type="button">Comprar</button>
        </div>
    </div>
</div>`;
}

//Popular produtos -> TODAS AS TVS

function populate(query) {
  $.ajax({
    url: `http://localhost:3000/listAll`,
    method: "GET",
    dataType: "json",
    data: query,
    statusCode: {
      200: function (data, status, xhr) {
        $(".box").html("");
        let content = `
        ${data.map(renderizaElement).join("")}`;
        $(".box").append(content);
        result = data;
      },
    },
  });
}

//Popular Filtros

function populateFilter() {
  $.ajax({
    url: "http://localhost:3000/filters",
    method: "GET",
    dataType: "json",
    statusCode: {
      200: function (data, status, xhr) {
        Object.entries(data).map(([key, value]) => {
          let content = `
        ${value
          .map(
            (element) => `   
            <div class="custom-control effect-3 custom-checkbox mb-1">
                  <input
                    data-filter='${key}'
                    class="custom-control-input "
                    value='${element}'
                    id="${element}"
                    type="checkbox"
                  />
                  <label class="custom-control-label" for="${element}"
                    >${element}</label
                  >
            </div>`
          )
          .join("")}`;
          $(`.${key}`).append(content);
        });

        $(".custom-control").on("click", "input", function () {
          let allFilters = Object.values($(".filters input"));
          console.log(this);
          let dataFilter = {};

          let selectedFilters = allFilters.filter((e) => e.checked);

          selectedFilters.forEach((e) => {
            const value = dataFilter[e.dataset.filter] || [];

            dataFilter[e.dataset.filter] = [...value, e.value];
          });

          populate(dataFilter);
        });
      },
    },
  });
}

// Função Barra de pesquisa

function searchBar(result, string) {
  const searched = result.filter((e) =>
    Object.values(e).some((value) =>
      value.toString().toLowerCase().includes(string)
    )
  );

  $(".box").html("");

  let content = `
  ${searched.map(renderizaElement).join("")}`;
  $(".box").append(content);
}

// Menu Mobile

function createMenu() {
  let cont = `  
<div class="top-nav">
      
<div class="content container filters">
<div class="brand">
<h1 class="card-title mt-0">Marca</h1>
</div>
<div class="screen_size">
<h1 class="card-title mt-0">Tipo</h1>
</div>
<div class="screen_type">
<h1 class="card-title mt-0">Tamanho</h1>
</div>
<div class="resolution">
<h1 class="card-title mt-0">Resolução</h1>
</div>
<div class="voltage">
<h1 class="card-title mt-0">Voltagem</h1>
</div>
</div>
</div>`;

  if (window.innerWidth <= 900) {
    $(".cz-header").append(cont);
    $(".filters")[1].remove();
  }
}

// Document ready

$(function () {
  createMenu();
  populate();
  populateFilter();

  $(".form-control").on("input", function (e) {
    const inputValue = e.target.value;
    searchBar(result, inputValue);
  });

  $(".menu-icon").on("click", function () {
    $(this).toggleClass("opened");
    $(".top-nav").toggleClass("ativo");
  });
});
