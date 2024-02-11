function convertMillisecondsToTimeFormat(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor(((seconds % 86400) % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedTime = `${days} ${String(hours).padStart(2, '0')}:${String(
    minutes
  ).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

  return formattedTime;
}

module.exports = {
  convertMillisecondsToTimeFormat,
};
