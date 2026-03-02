/**
 * Traducciones: español dominicano (default) y inglés para extranjeros.
 * La app está enfocada en español dominicano.
 */

export type Locale = "es" | "en";

export const defaultLocale: Locale = "es";
export const locales: Locale[] = ["es", "en"];

export const translations = {
  es: {
    // Marca y valor
    appName: "Rapidisimo",
    tagline: "Pedís tranquilo. Te protegemos.",
    taglineShort: "Delivery con garantía. Sin sorpresas.",

    // Navegación
    nav: {
      inicio: "Inicio",
      menu: "Menú",
      carrito: "Carrito",
      misPedidos: "Mis pedidos",
      ayuda: "Ayuda",
      soyNegocio: "Soy negocio",
      idioma: "Idioma",
    },

    // Landing
    landing: {
      heroTitle: "La app de delivery más segura de República Dominicana",
      heroSubtitle:
        "Precio claro antes de pagar. Repartidores verificados. Garantía de reembolso si algo sale mal. Pedí con la misma tranquilidad que por WhatsApp, con más respaldo.",
      ctaEmpezar: "Empezar a pedir",
      ctaVerMenu: "Ver menú",
      porqueElegirnos: "¿Por qué Rapidisimo?",
      razon1Title: "Precio claro",
      razon1Desc: "El monto que ves es el que pagás. Sin cargos ocultos.",
      razon2Title: "Repartidores verificados",
      razon2Desc: "Sabés quién te entrega. Nombre, foto y seguimiento en vivo.",
      razon3Title: "Garantía Rapidisimo",
      razon3Desc: "Si no llega o no es lo que pediste, te devolvemos. Punto.",
      miedoEstafa: "¿Miedo a que te estafen?",
      miedoRespuesta:
        "Acá el precio es claro, podés pagar al recibir y si algo falla, te devolvemos.",
      irDirectoRegistro: "Continuar directo a pedir (sin ver introducción)",
    },

    // Soy negocio / restaurantes aliados
    soyNegocio: {
      titulo: "¿Querés vender con Rapidisimo?",
      subtitulo:
        "Si tenés un restaurante, colmado o dark kitchen en RD, dejá tus datos y te contactamos para activarte con garantía de cobro.",
      bloqueComoFuncionaTitulo: "Cómo funciona para tu negocio",
      bloqueComoFunciona1:
        "Vos seguís cocinando como siempre. Nosotros nos encargamos del cobro seguro y el delivery.",
      bloqueComoFunciona2:
        "Tu dinero queda protegido: solo liberamos el pago cuando el cliente confirma que todo llegó bien.",
      bloqueComoFunciona3:
        "Tenés un canal directo con nosotros para cualquier reclamo de clientes. No quedás solo.",
      formularioTitulo: "Dejá tus datos y te llamamos",
      nombreNegocio: "Nombre del negocio",
      nombreNegocioPlaceholder: "Ej: Pica Pollo La Esquina",
      contactoNombre: "Nombre de contacto",
      contactoTelefono: "Teléfono / WhatsApp",
      contactoTelefonoPlaceholder: "Ej: 8XX-XXX-XXXX",
      direccion: "Dirección / sector",
      direccionPlaceholder: "Calle, número, sector, ciudad",
      tipoNegocio: "Tipo de negocio",
      tipoNegocioPlaceholder: "Restaurante, colmado, dark kitchen, etc.",
      horario: "Horario aproximado",
      horarioPlaceholder: "Ej: Lun-Dom 11:00 am - 11:00 pm",
      btnEnviar: "Enviar solicitud",
      avisoPrivacidad:
        "Usamos estos datos solo para contactarte sobre Rapidisimo. No los compartimos con terceros.",
      enviadoTitulo: "Solicitud enviada",
      enviadoDescripcion:
        "Gracias por tu interés. Te vamos a escribir por WhatsApp o llamar en las próximas 24–48 horas hábiles.",
    },

    // Onboarding
    onboarding: {
      paso1Title: "Pedí como en WhatsApp, con más respaldo",
      paso1Desc: "Mismo control: elegís, confirmás, recibís. Con garantía y seguimiento.",
      paso2Title: "Precio claro antes de confirmar",
      paso2Desc: "Sin sorpresas en la factura. El monto que ves es el que pagás.",
      paso3Title: "Repartidores verificados",
      paso3Desc: "Sabés quién viene a tu puerta. Podés seguirlo en vivo.",
      paso4Title: "Si algo sale mal, te cubrimos",
      paso4Desc: "Garantía Rapidisimo: si no llega o no es lo pedido, te devolvemos.",
      siguiente: "Siguiente",
      empezar: "Empezar a pedir",
      saltar: "Saltar",
    },

    // Badges y confianza
    badges: {
      pagoSeguro: "Pago Seguro",
      proteccionComprador: "Protección al Comprador",
      repartidorVerificado: "Repartidor verificado",
      garantiaRapidisimo: "Garantía Rapidisimo",
    },

    // Checkout
    checkout: {
      titulo: "Confirmar pedido",
      resumen: "Resumen del pedido",
      montoClaro: "Este es el monto total. No hay cargos ocultos.",
      subtotal: "Subtotal",
      envio: "Envío",
      total: "Total a pagar",
      metodoPago: "Método de pago",
      pagoRecibir: "Pagar al recibir",
      pagoRecibirDesc: "Pagás solo cuando recibís tu pedido. Sin riesgos.",
      pagoTarjeta: "Pagar con tarjeta",
      pagoTarjetaDesc: "Pago seguro. Tus datos encriptados. Protección al comprador incluida.",
      garantiaAntesConfirmar:
        "Al confirmar, tu pedido queda cubierto por la Garantía Rapidisimo.",
      confirmarPedido: "Confirmar pedido (con garantía)",
      reaseguroFooter:
        "Si algo sale mal, te devolvemos o reponemos. Chat y teléfono para reclamar.",
    },

    // Garantía
    garantia: {
      titulo: "Garantía Rapidisimo",
      corta:
        "Si no llega o no es lo que pediste, te devolvemos o reponemos. Reclamá en menos de 24 h por chat o teléfono.",
      condiciones: "Ver condiciones",
    },

    // Tracking
    tracking: {
      confirmado: "Confirmado",
      enPreparacion: "En preparación",
      repartidorAsignado: "Repartidor asignado",
      enCamino: "En camino",
      entregado: "Entregado",
      seguimientoEnVivo: "Seguimiento en vivo",
      repartidor: "Repartidor",
      problemaPedido:
        "¿Algo no cuadra con tu pedido? Reclamá desde acá en menos de 24 h.",
      btnReclamar: "Reclamar o pedir ayuda",
    },

    // Post-entrega
    postEntrega: {
      titulo: "¿Llegó todo bien?",
      subtitulo:
        "Si algo faltó o no es lo que pediste, reclamá acá en menos de 24 h.",
      gracias: "Gracias por pedir con nosotros. Tu garantía sigue activa.",
    },

    // Ayuda / Soporte
    ayuda: {
      titulo: "¿Problemas con tu pedido?",
      subtitulo:
        "Escribinos por chat o llamá. Resolvemos en menos de 24 h. Garantía Rapidisimo.",
      chat: "Chat",
      telefono: "Llamar",
      garantiaTexto:
        "Cumplimos con la Ley de Protección al Consumidor y estamos a disposición de Pro Consumidor.",
    },

    // Datos protegidos
    datos: {
      protegidos: "Tu información está protegida. No vendemos tus datos ni los compartimos con terceros.",
      soloDireccion: "Solo usamos tu dirección para entregar. Podés pedir sin guardar tarjeta.",
    },

    // Registro
    registro: {
      titulo: "Continuar a pedir",
      subtitulo: "Datos solo para entregar tu pedido. Nada más.",
      nombre: "Nombre",
      telefono: "Teléfono",
      direccion: "Dirección de entrega",
      direccionPlaceholder: "Calle, número, sector, ciudad",
      continuarAlMenu: "Continuar al menú",
      sinTarjeta: "No hace falta guardar tarjeta. Podés pagar al recibir.",
      politicaPrivacidad: "Al continuar aceptás nuestra política de privacidad.",
    },

    // Objeciones (FAQ / microcopy)
    objeciones: {
      meEstafan: "¿Me van a estafar?",
      meEstafanR: "No. Precio fijo al confirmar, repartidores verificados y garantía de reembolso.",
      vendenDatos: "¿Van a vender mis datos?",
      vendenDatosR:
        "No. Tu información es solo para entregar y cumplir tu pedido. Política de privacidad clara.",
      cobranDeMas: "¿Me van a cobrar de más?",
      cobranDeMasR:
        "No. El monto que ves al confirmar es el que pagás. Pago al recibir disponible.",
    },

    // Menú / Productos
    menu: {
      titulo: "Menú",
      categorias: "Categorías",
      agregar: "Agregar",
      carrito: "Carrito",
      pedidoConProteccion: "Pedido con Protección al Comprador. Precio final claro antes de confirmar.",
    },

    // Carrito
    carrito: {
      titulo: "Tu carrito",
      vacio: "Tu carrito está vacío",
      irAlMenu: "Ir al menú",
      continuar: "Continuar al checkout",
    },

    // Común
    common: {
      cantidad: "Cantidad",
      precio: "Precio",
      total: "Total",
      cerrar: "Cerrar",
      volver: "Volver",
      quitar: "Quitar",
      otroPedido: "Hacer otro pedido",
      irAlMenu: "Ir al menú",
    },
  },

  en: {
    appName: "Rapidisimo",
    tagline: "Order with peace of mind. We've got you covered.",
    taglineShort: "Delivery with guarantee. No surprises.",

    nav: {
      inicio: "Home",
      menu: "Menu",
      carrito: "Cart",
      misPedidos: "My orders",
      ayuda: "Help",
      soyNegocio: "For businesses",
      idioma: "Language",
    },

    landing: {
      heroTitle: "The safest delivery app in the Dominican Republic",
      heroSubtitle:
        "Clear price before you pay. Verified drivers. Refund guarantee if something goes wrong. Order with the same peace of mind as WhatsApp, with more backup.",
      ctaEmpezar: "Start ordering",
      ctaVerMenu: "View menu",
      porqueElegirnos: "Why Rapidisimo?",
      razon1Title: "Clear pricing",
      razon1Desc: "What you see is what you pay. No hidden fees.",
      razon2Title: "Verified drivers",
      razon2Desc: "You know who's delivering. Name, photo, and live tracking.",
      razon3Title: "Rapidisimo Guarantee",
      razon3Desc: "If it doesn't arrive or isn't what you ordered, we refund you. Period.",
      miedoEstafa: "Worried about getting scammed?",
      miedoRespuesta:
        "Here the price is clear, you can pay on delivery, and if something goes wrong, we refund you.",
      irDirectoRegistro: "Continue straight to order (skip intro)",
    },

    soyNegocio: {
      titulo: "Want to sell through Rapidisimo?",
      subtitulo:
        "If you run a restaurant, grocery or dark kitchen in the DR, leave your details and we’ll contact you to activate with secure payments.",
      bloqueComoFuncionaTitulo: "How it works for your business",
      bloqueComoFunciona1:
        "You keep cooking as usual. We handle secure payment and delivery.",
      bloqueComoFunciona2:
        "Your money is protected: we only release payment when the customer confirms everything arrived correctly.",
      bloqueComoFunciona3:
        "You have a direct channel with us for any customer issues. You’re not left alone.",
      formularioTitulo: "Leave your details and we’ll contact you",
      nombreNegocio: "Business name",
      nombreNegocioPlaceholder: "e.g. Pica Pollo La Esquina",
      contactoNombre: "Contact name",
      contactoTelefono: "Phone / WhatsApp",
      contactoTelefonoPlaceholder: "e.g. 8XX-XXX-XXXX",
      direccion: "Address / area",
      direccionPlaceholder: "Street, number, neighborhood, city",
      tipoNegocio: "Business type",
      tipoNegocioPlaceholder: "Restaurant, grocery, dark kitchen, etc.",
      horario: "Approximate opening hours",
      horarioPlaceholder: "e.g. Mon–Sun 11:00 am – 11:00 pm",
      btnEnviar: "Send request",
      avisoPrivacidad:
        "We only use this data to contact you about Rapidisimo. We do not share it with third parties.",
      enviadoTitulo: "Request sent",
      enviadoDescripcion:
        "Thanks for your interest. We’ll text you on WhatsApp or call you in the next 24–48 business hours.",
    },

    onboarding: {
      paso1Title: "Order like on WhatsApp, with more backup",
      paso1Desc: "Same control: you choose, confirm, receive. With guarantee and tracking.",
      paso2Title: "Clear price before you confirm",
      paso2Desc: "No surprises on the bill. What you see is what you pay.",
      paso3Title: "Verified drivers",
      paso3Desc: "You know who's coming to your door. You can track them live.",
      paso4Title: "If something goes wrong, we've got you",
      paso4Desc: "Rapidisimo Guarantee: if it doesn't arrive or isn't what you ordered, we refund you.",
      siguiente: "Next",
      empezar: "Start ordering",
      saltar: "Skip",
    },

    badges: {
      pagoSeguro: "Secure Payment",
      proteccionComprador: "Buyer Protection",
      repartidorVerificado: "Verified driver",
      garantiaRapidisimo: "Rapidisimo Guarantee",
    },

    checkout: {
      titulo: "Confirm order",
      resumen: "Order summary",
      montoClaro: "This is the total. No hidden charges.",
      subtotal: "Subtotal",
      envio: "Delivery",
      total: "Total to pay",
      metodoPago: "Payment method",
      pagoRecibir: "Pay on delivery",
      pagoRecibirDesc: "You only pay when you receive your order. No risk.",
      pagoTarjeta: "Pay with card",
      pagoTarjetaDesc: "Secure payment. Your data encrypted. Buyer protection included.",
      garantiaAntesConfirmar:
        "By confirming, your order is covered by the Rapidisimo Guarantee.",
      confirmarPedido: "Confirm order (with guarantee)",
      reaseguroFooter:
        "If something goes wrong, we refund or replace. Chat and phone to claim.",
    },

    garantia: {
      titulo: "Rapidisimo Guarantee",
      corta:
        "If it doesn't arrive or isn't what you ordered, we refund or replace. Claim within 24 hours via chat or phone.",
      condiciones: "View terms",
    },

    tracking: {
      confirmado: "Confirmed",
      enPreparacion: "Preparing",
      repartidorAsignado: "Driver assigned",
      enCamino: "On the way",
      entregado: "Delivered",
      seguimientoEnVivo: "Live tracking",
      repartidor: "Driver",
      problemaPedido:
        "Something wrong with your order? Claim here within 24 hours.",
      btnReclamar: "Claim or get help",
    },

    postEntrega: {
      titulo: "Did everything arrive okay?",
      subtitulo:
        "If something was missing or isn't what you ordered, claim here within 24 hours.",
      gracias: "Thanks for ordering with us. Your guarantee is still active.",
    },

    ayuda: {
      titulo: "Problems with your order?",
      subtitulo:
        "Chat or call us. We resolve within 24 hours. Rapidisimo Guarantee.",
      chat: "Chat",
      telefono: "Call",
      garantiaTexto:
        "We comply with Consumer Protection Law and are available to Pro Consumidor.",
    },

    datos: {
      protegidos:
        "Your information is protected. We don't sell your data or share it with third parties.",
      soloDireccion:
        "We only use your address for delivery. You can order without saving your card.",
    },

    registro: {
      titulo: "Continue to order",
      subtitulo: "Data only to deliver your order. Nothing else.",
      nombre: "Name",
      telefono: "Phone",
      direccion: "Delivery address",
      direccionPlaceholder: "Street, number, area, city",
      continuarAlMenu: "Continue to menu",
      sinTarjeta: "No need to save your card. You can pay on delivery.",
      politicaPrivacidad: "By continuing you accept our privacy policy.",
    },

    objeciones: {
      meEstafan: "Will I get scammed?",
      meEstafanR:
        "No. Fixed price at confirm, verified drivers, and refund guarantee.",
      vendenDatos: "Will you sell my data?",
      vendenDatosR:
        "No. Your information is only for delivery and your order. Clear privacy policy.",
      cobranDeMas: "Will I be overcharged?",
      cobranDeMasR:
        "No. The amount you see at confirm is what you pay. Pay on delivery available.",
    },

    menu: {
      titulo: "Menu",
      categorias: "Categories",
      agregar: "Add",
      carrito: "Cart",
      pedidoConProteccion:
        "Order with Buyer Protection. Final price clear before you confirm.",
    },

    carrito: {
      titulo: "Your cart",
      vacio: "Your cart is empty",
      irAlMenu: "Go to menu",
      continuar: "Continue to checkout",
    },

    common: {
      cantidad: "Quantity",
      precio: "Price",
      total: "Total",
      cerrar: "Close",
      volver: "Back",
      quitar: "Remove",
      otroPedido: "Place another order",
      irAlMenu: "Go to menu",
    },
  },
} as const;

export type Translations = (typeof translations)[Locale];

export function getTranslations(locale: Locale): Translations {
  return translations[locale] ?? translations.es;
}
