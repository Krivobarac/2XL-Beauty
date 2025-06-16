class ServiceTabsComponent extends HTMLElement {
    connectedCallback() {
        fetch(this.getAttribute("serviceDataSrc"))
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
                return res.json()
                })
            .then(data => {
                const serviceData = data || [];
                const serviceTitle = this.getAttribute("serviceTitle") || "";
                const serviceImage = this.getAttribute("serviceImage") || "";
                const serviceImageAlt = this.getAttribute("serviceImageAlt") || "";
                const firstTab = serviceData[0]?.serviceTab || "";

                const serviceLine = (service) => {
                    return `<li class="${service.indent ? "indent" : ""}">
                        <span>
                            ${service.indent
                            ? "<span class='bullet'>•</span>"
                            : ""}
                            <span> ${service.serviceTabTitle}</span>
                        </span>
                        <span>${service.servicePrice}</span>
                    </li>`
                }

                this.innerHTML = `
                    <div class="services__tabs">
                        <div class="services__tabs__box">
                            <h2 class="services__tabs__box__title">${serviceTitle}</h2>
                            <div class="services__tabs__box__tabs">
                            ${serviceData
                                    .map(
                                        (data, index) =>
                                            `<button tabindex="${index}" role="tab"
                                        data-tab="${data.serviceTab}"
                                        aria-selected="${data.serviceTab === firstTab}"
                                        class="${data.serviceTab === firstTab ? "active" : ""} ${!data.serviceTab ? "hidden" : ""}">
                                        ${data.serviceTab}
                                    </button>`
                                    )
                                    .join("")}
                            </div>
                            <ul class="services__tabs__box__menu">
                            ${serviceData
                                    .find((data) => data.serviceTab === firstTab)
                                    .services.map(
                                        (service) => serviceLine(service)
                                    )
                                    .join("")}
                            </ul>
                            <div class="services__tabs__box__actions">
                                <button>Zakaži</button>
                                <a href="src/pricing.html" target="_blank" role="button">sve cene</a>
                            </div>
                        </div>
                        ${serviceImage
                        ? `<img class="services__tabs__box" src="${serviceImage}" alt="${serviceImageAlt}" />`
                        : ""}
                    </div>`;

                if (!serviceImage) {
                    this.classList.add("half");
                }

                const buttons = this.querySelectorAll(".services__tabs__box__tabs button");
                const menu = this.querySelector(".services__tabs__box__menu");

                buttons.forEach((btn) => {
                    btn.addEventListener("click", () => {
                        buttons.forEach((b) => b.classList.remove("active"));
                        btn.classList.add("active");

                        const activeTab = serviceData.find(
                            (data) => data.serviceTab === btn.dataset.tab
                        );
                        menu.innerHTML = activeTab.services
                            .map(
                                (service) => serviceLine(service)
                            )
                            .join("");
                    });
                });
            }).catch((error) => {
                console.error("Error fetching service data:", error);
            });

    }
}

customElements.define("service-component", ServiceTabsComponent);
