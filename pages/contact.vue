<template>
    <div class="h-screen flex items-center justify-center">
        <div>
            <h1 class="text-2xl font-bold text-center">Contact Us:</h1>
            <form @submit.prevent="submit(form)">
                <div class="input-wrapper">
                    <label for="email">E-mail:</label>
                    <input required v-model="form.email" type="email" name="email" />
                </div>
                <div class="input-wrapper">
                    <label for="name">Name:</label>
                    <input required v-model="form.name" type="text" name="name" />
                </div>
                <div class="input-wrapper">
                    <label for="subject">Subject:</label>
                    <input required v-model="form.subject" type="text" name="subject" />
                </div>
                <div class="input-wrapper">
                    <label for="message">Message:</label>
                    <textarea required v-model="form.message" type="text" name="message"></textarea>
                </div>
                <div id="submitButton">
                    <button type="submit">
                        <template v-if="waiting">loading...</template>
                        <template v-if="!waiting">Submit</template>
                    </button>
                </div>
                <p v-if="errors">Something Went Wrong</p>
                <p v-if="succsess">Form Is sent</p>
            </form>
        </div>
    </div>
</template>

<script setup>
    const form = ref({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const errors = ref(false);
    const succsess = ref(false);
    const waiting = ref(false);

    async function submit(form) {
        this.waiting = true;
        await $fetch("/api/contact", {
            method: "POST",
            body: form,
        }).then(() => {
            this.errors = false;
            this.succsess = true;
            this.waiting = false;
            this.form = {
                name: "",
                email: "",
                subject: "",
                message: "",
            };
        });
    }
</script>

<style scoped>
    body {
        font-family: "Arial", sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
    }

    form {
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        width: 100%;
    }

    .input-wrapper {
        margin-bottom: 15px;
    }

    label {
        display: block;
        font-weight: bold;
        margin-bottom: 5px;
    }

    input,
    textarea {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 4px;
        margin-top: 3px;
        margin-bottom: 10px;
    }

    #submitButton {
        background-color: grey;
        border-radius: 6px;
        text-align: center;
        padding: 20;
        align-items: center;
        color: white;
        margin: auto;
    }

    p {
        color: #ff0000;
        margin-top: 10px;
        font-weight: bold;
        align-items: center;
    }
</style>
