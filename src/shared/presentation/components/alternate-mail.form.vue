<template>
  <Dialog
      v-model:visible="visible"
      :header="t('configuration.form.title')"
      :modal="true"
      :style="{ width: '400px' }"
      :breakpoints="{ '576px': '90vw' }"
      @update:visible="onHide"
  >
    <div class="p-fluid dialog-content">
      <div class="field">
        <InputText
            id="alternateEmail"
            v-model="email"
            type="email"
            :placeholder="t('configuration.form.placeholder')"
            :class="{ 'p-invalid': error }"
        />
        <small v-if="error" class="p-error">{{ error }}</small>
      </div>
    </div>

    <template #footer>
      <Button
          :label="t('configuration.form.cancel')"
          icon="pi pi-times"
          text
          @click="close"
      />
      <Button
          :label="t('configuration.form.save')"
          icon="pi pi-check"
          @click="save"
          :loading="loading"
      />
    </template>
  </Dialog>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const { t } = useI18n();

const props = defineProps({
  visible: Boolean,
  modelValue: String
});

const emit = defineEmits(['update:visible', 'save']);

const email = ref(props.modelValue || '');
const error = ref('');
const loading = ref(false);
const visible = ref(props.visible);

// Sincronizar el valor inicial si cambia desde afuera
watch(() => props.modelValue, (newVal) => {
  email.value = newVal || '';
});
watch(() => props.visible, (newVal) => {
  visible.value = newVal;
});

const validate = () => {
  error.value = '';
  const value = email.value.trim();
  if (!value) {
    error.value = t('configuration.form.emailRequired');
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    error.value = t('configuration.form.emailInvalid');
    return false;
  }
  return true;
};

const save = async () => {
  if (!validate()) return;
  loading.value = true;
  try {
    // Aquí iría tu lógica de API (ej: await api.updateAlternateEmail(email.value))
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulación
    emit('save', email.value);
    close();
  } catch (err) {
    error.value = t('configuration.form.errorSaving');
  } finally {
    loading.value = false;
  }
};

const close = () => {
  email.value = '';
  error.value = '';
  emit('update:visible', false);
};

const onHide = () => {
  close();
};
</script>

<style scoped>
.dialog-content {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f8fafc;
  border-radius: 18px;
  padding: 24px 18px 12px 18px;
  box-shadow: 0 4px 24px rgba(30,41,59,0.08);
}
.field {
  margin-bottom: 1.5rem;
}
label {
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 8px;
  display: block;
}
.p-inputtext {
  width: 100%;
  height: 48px;
  font-size: 16px;
  border-radius: 12px;
  border: 1px solid #d1d5db;
  padding: 0 16px;
  background: #fff;
  color: #1e293b;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
.p-inputtext:focus {
  border-color: #10b981;
  outline: none;
}
.p-error {
  color: #ef4444;
  font-size: 13px;
  margin-top: 6px;
}
.p-dialog .p-dialog-content {
  padding: 0;
}
.p-dialog .p-dialog-header {
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
  font-size: 20px !important;
  font-weight: 700 !important;
  color: #1e293b !important;
  letter-spacing: 0.01em;
}
.p-dialog .p-dialog-footer {
  border-bottom-left-radius: 18px;
  border-bottom-right-radius: 18px;
  padding-bottom: 18px;
  padding-right: 18px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
.p-button {
  border-radius: 10px !important;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  font-size: 15px;
  font-weight: 600;
  padding: 8px 20px;
}
</style>