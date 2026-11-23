
// ========================================
// КАЛЕНДАРЬ
// ========================================

const calendar = document.querySelector("#calendar");

const january2027 = new Date(2027, 0, 1);

// Определяем день недели
// Понедельник = 0, воскресенье = 6

const startOffset = (january2027.getDay() + 6) % 7;

// Добавляем пустые ячейки перед первым числом

for (let i = 0; i < startOffset; i += 1) {
    const empty = document.createElement("span");

    empty.className = "empty-day";

    empty.setAttribute("aria-hidden", "true");

    calendar.append(empty);
}

// Добавляем дни месяца

for (let day = 1; day <= 31; day += 1) {

    const cell = document.createElement("span");

    cell.className =
        day === 23 ? "day day--active" : "day";

    cell.textContent = day;

    if (day === 23) {
        cell.setAttribute(
            "aria-label",
            "23 января — день рождения"
        );

        cell.setAttribute("aria-current", "date");
    }

    calendar.append(cell);
}


// ========================================
// КНОПКИ ПРИСУТСТВИЯ
// ========================================

const rsvpNote = document.querySelector("#rsvp-note");

const rsvpButtons = document.querySelectorAll("[data-rsvp]");

rsvpButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const answer = button.dataset.rsvp;

        const message =
            answer === "yes"
                ? "Ура! Буду ждать тебя 🤎"
                : "Спасибо, что предупредил(а). Буду скучать 🤎";

        // Показываем сообщение

        rsvpNote.textContent = message;

        // Сохраняем ответ в браузере

        try {
            localStorage.setItem("birthday-rsvp", answer);
        } catch (error) {
            console.warn(
                "Не удалось сохранить ответ в браузере.",
                error
            );
        }

        // Убираем выделение с обеих кнопок

        rsvpButtons.forEach((item) => {
            item.classList.remove("is-selected");
        });

        // Выделяем выбранную кнопку

        button.classList.add("is-selected");

    });

});


// ========================================
// ЛОГИКА "Я НЕ ПЬЮ"
// ========================================

const alcoholOptions = [
    ...document.querySelectorAll('input[name="alcohol"]')
];

const noAlcohol = document.querySelector("#no-alcohol");

alcoholOptions.forEach((input) => {

    input.addEventListener("change", () => {

        // Если выбрали "Я не пью"

        if (input === noAlcohol && noAlcohol.checked) {

            // Снимаем все остальные варианты

            alcoholOptions.forEach((option) => {

                if (option !== noAlcohol) {
                    option.checked = false;
                }

            });

        }

        // Если выбрали другой алкоголь

        else if (input !== noAlcohol && input.checked) {

            // Снимаем "Я не пью"

            noAlcohol.checked = false;

        }

    });

});


// ========================================
// ВАРИАНТ "ДРУГОЕ"
// ========================================

const otherDrink = document.querySelector("#other-drink");

const otherField = document.querySelector("#other-field");

otherDrink.addEventListener("change", () => {

    // Показываем или скрываем поле

    otherField.hidden = !otherDrink.checked;

    // Если сняли галочку — очищаем поле

    if (!otherDrink.checked) {

        document.querySelector("#other-drink-text").value = "";

    }

});


// ========================================
// ОТПРАВКА АНКЕТЫ
// ========================================

const form = document.querySelector("#guest-form");

const formStatus = document.querySelector("#form-status");

form.addEventListener("submit", (event) => {

    // Отменяем стандартную отправку формы

    event.preventDefault();

    // Получаем данные формы

    const data = new FormData(form);

    const response = {

        allergies: String(
            data.get("allergies") || ""
        ).trim(),

        alcohol: data.getAll("alcohol"),

        softDrinks: data.getAll("soft"),

        otherDrink: String(
            data.get("otherDrink") || ""
        ).trim(),

        submittedAt: new Date().toISOString()

    };


    // Сохраняем ответы

    try {

        const saved = JSON.parse(
            localStorage.getItem("birthday-guest-responses") || "[]"
        );

        saved.push(response);

        localStorage.setItem(
            "birthday-guest-responses",
            JSON.stringify(saved)
        );

        // Показываем сообщение об успехе

        formStatus.textContent =
            "Спасибо! Ответы сохранены в этом браузере 🤎";

        // Очищаем форму

        form.reset();

        otherField.hidden = true;

    } catch (error) {

        formStatus.textContent =
            "Не удалось сохранить ответы. Попробуй ещё раз.";

        console.error(error);

    }

});


// ========================================
// ВОССТАНОВЛЕНИЕ RSVP ПОСЛЕ ОБНОВЛЕНИЯ
// ========================================

try {

    const savedRsvp = localStorage.getItem("birthday-rsvp");

    if (savedRsvp) {

        const button = document.querySelector(
            `[data-rsvp="${savedRsvp}"]`
        );

        if (button) {

            button.classList.add("is-selected");

            rsvpNote.textContent =
                savedRsvp === "yes"
                    ? "Ура! Буду ждать тебя 🤎"
                    : "Спасибо, что предупредил(а). Буду скучать 🤎";

        }

    }

} catch (error) {

    // Сайт продолжит работать,
    // даже если localStorage недоступен.

}
