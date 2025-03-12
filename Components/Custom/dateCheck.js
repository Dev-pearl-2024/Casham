export function compareDates(inputDate) {
    const today = new Date();
    const givenDate = new Date(inputDate);

    today.setHours(0, 0, 0, 0);
    givenDate.setHours(0, 0, 0, 0);

    if (today.getTime() === givenDate.getTime()) {
        return "Today";
    }

    const timeDifference = today - givenDate;
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    if (daysDifference > 0) {
        return `${Math.floor(daysDifference)} days ago`;
    } else {
        return `Future date: ${Math.floor(daysDifference)} days ahead`;
    }
}