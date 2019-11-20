var dropdownAlert;

export function error(title, message) {
  dropdownAlert.alertWithType('error', title, message);
}

export function info(title, message) {
  dropdownAlert.alertWithType('info', title, message);
}

export function warn(title, message) {
  dropdownAlert.alertWithType('warn', title, message);
}

export function setRef(ref) {
  dropdownAlert = ref;
}
