import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { CalendarEvent } from '../types/calendar';

export const getMonthEvents = async (startDate: Date, endDate: Date) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', user.id)
      .gte('start_time', format(startDate, "yyyy-MM-dd'T'HH:mm:ssXXX"))
      .lte('start_time', format(endDate, "yyyy-MM-dd'T'HH:mm:ssXXX"))
      .order('start_time', { ascending: true });

    if (error) throw error;

    const eventsByDate: { [key: string]: CalendarEvent[] } = {};
    data?.forEach(event => {
      const date = event.start_time.split('T')[0];
      if (!eventsByDate[date]) {
        eventsByDate[date] = [];
      }
      eventsByDate[date].push(event);
    });

    return eventsByDate;
  } catch (error) {
    console.error('Error fetching month events:', error);
    throw error;
  }
};

export const getDayEvents = async (date: Date) => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('calendar_events')
      .select('*')
      .eq('user_id', user.id)
      .gte('start_time', format(date, "yyyy-MM-dd'T'00:00:00XXX"))
      .lte('start_time', format(date, "yyyy-MM-dd'T'23:59:59XXX"))
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching day events:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};