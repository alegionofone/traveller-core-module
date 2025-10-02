// scripts/traveller-core.js

Hooks.once("init", () => {
  if (!Handlebars.helpers.eq) {
    Handlebars.registerHelper("eq", (a, b) => a === b);
  }
});

Hooks.once("init", () => {
  if (!Handlebars.helpers.array) {
    Handlebars.registerHelper("array", (...args) => args.slice(0, -1));
  }
  if (!Handlebars.helpers.eq) {
    Handlebars.registerHelper("eq", (a,b) => a === b);
  }
});

class TravellerCoreActorSheet extends ActorSheet {
  static get defaultOptions() {
    const opts = super.defaultOptions;
    opts.classes = [...(opts.classes ?? []), "traveller-core", "traveller-core-actor"];
    opts.template = "modules/traveller-core-module/templates/actor/traveller-core-actor.hbs";
    opts.width = 820;
    opts.height = 640;
    return opts;
  }

  getData(options) {
    const data = super.getData(options);
    data.system = this.actor.system ?? {};
    data.flags = this.actor.flags ?? {};
    data.items = this.actor.items ?? [];
    data.actorType = this.actor.type;
    return data;
  }

  activateListeners(html) {
    super.activateListeners(html);
    if (!this.isEditable) return;

    html.find("[data-tab-target]").on("click", (ev) => {
      const target = ev.currentTarget.getAttribute("data-tab-target");
      html.find("[data-tab]").hide();
      html.find(`[data-tab="${target}"]`).show();
      html.find("[data-tab-target]").removeClass("is-active");
      ev.currentTarget.classList.add("is-active");
    });

    html.find('[data-edit="system.bio"]').on("change", (ev) => {
      this.actor.update({ "system.bio": ev.currentTarget.value });
    });
  }
}

Hooks.once("init", async () => {
  await loadTemplates([
    "modules/traveller-core-module/templates/actor/actor-partials/characteristics-partial.hbs"
  ]);

  Actors.registerSheet("traveller-core", TravellerCoreActorSheet, {
    label: "Traveller - Dominion",
    makeDefault: true
  });
});
