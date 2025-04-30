export function formatFriendshipDuration(dateString: string) {
  const pastDate = new Date(dateString);
  const now = new Date();

  if (pastDate > now) {
    return 'date in the future';
  }

  let years = now.getFullYear() - pastDate.getFullYear();
  let months = now.getMonth() - pastDate.getMonth();
  let days = now.getDate() - pastDate.getDate();
  let hours = now.getHours() - pastDate.getHours();
  let minutes = now.getMinutes() - pastDate.getMinutes();
  let seconds = now.getSeconds() - pastDate.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }
  if (minutes < 0) {
    minutes += 60;
    hours--;
  }
  if (hours < 0) {
    hours += 24;
    days--;
  }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
    months--;
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  if (years >= 1) {
    return `${years} ${years === 1 ? 'ano' : 'anos'}`;
  } else if (months >= 1) {
    return `${months} ${months === 1 ? 'mês' : 'meses'}`;
  } else if (days >= 1) {
    return `${days} ${days === 1 ? 'dia' : 'dias'}`;
  } else if (hours >= 1) {
    return `${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  } else if (minutes >= 1) {
    return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  } else {
    return `${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`;
  }
}
