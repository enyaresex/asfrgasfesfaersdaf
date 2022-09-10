import dayjs from 'dayjs';
import texts from '../data/notifications.json';

export default function hydrateNotification(
  notification: FSNotification,
  languageCode: LanguageCode,
): HydratedNotification {
  const languageTexts = texts[languageCode] as Record<string, string>;

  let title = languageTexts[`${notification.key}Title`];
  let description = languageTexts[notification.key];

  if (notification.textVars !== null) {
    Object.entries(notification.textVars).forEach(([k, v]) => {
      const regExpK = new RegExp(`{${k}}`, 'g');

      title = title.replace(regExpK, v.toString());
      description = description.replace(regExpK, v.toString());
    });
  }

  const titleSearch = title.match(/{(.*?)}/g);

  if (titleSearch !== null) {
    titleSearch.forEach((p) => {
      const languageTextKey = p.slice(1, -1);
      const variable = languageTexts[languageTextKey];

      if (variable !== undefined) {
        const regExpP = new RegExp(p, 'g');

        title = title.replace(regExpP, variable);
      }
    });
  }

  const descriptionSearch = description.match(/{(.*?)}/g);

  if (descriptionSearch !== null) {
    descriptionSearch.forEach((p) => {
      const languageTextKey = p.slice(1, -1);
      const variable = languageTexts[languageTextKey];

      if (variable !== undefined) {
        const regExpP = new RegExp(p, 'g');

        description = description.replace(regExpP, variable);
      }
    });
  }

  return {
    ...notification,
    action: {
      ...notification.action,
      title: languageTexts[notification.action.key],
    },
    dateTimeDisplay: dayjs(notification.timestamp.toDate()).format('ll, LT'),
    title,
    description,
  };
}
