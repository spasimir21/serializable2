import { createSerializer } from '../ISerializer';
import { BigInt64, Int16 } from './Numbers';

const _Date = createSerializer<Date>({
  write: (value, writer, context) => BigInt64.write(BigInt(value.getTime()), writer, context),
  read: (reader, context) => new Date(Number(BigInt64.read(reader, context)))
});

interface LocalDate {
  timezoneOffset: number;
  date: Date;
}

function toLocalDate(date: Date): LocalDate {
  return {
    timezoneOffset: date.getTimezoneOffset(),
    date
  };
}

const LocalDate = createSerializer<LocalDate>({
  write: (value, writer, context) => {
    Int16.write(value.timezoneOffset, writer, context);
    BigInt64.write(BigInt(value.date.getTime()), writer, context);
  },
  read: (reader, context) => {
    const timezoneOffset = Int16.read(reader, context);
    const time = Number(BigInt64.read(reader, context));

    return {
      timezoneOffset,
      date: new Date(time)
    };
  }
});

export { _Date, LocalDate, toLocalDate };
