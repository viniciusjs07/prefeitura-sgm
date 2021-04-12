export const trim = (fieldName, formName) => {
    const prop = formName.get(fieldName);
    const trimmed = (prop.value || '').trim();
    prop.setValue(trimmed)
};
