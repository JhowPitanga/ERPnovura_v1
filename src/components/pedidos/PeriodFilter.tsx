
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, startOfDay, endOfDay, subDays, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";

interface PeriodFilterProps {
  onDateRangeChange: (startDate: Date | null, endDate: Date | null) => void;
}

export function PeriodFilter({ onDateRangeChange }: PeriodFilterProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [open, setOpen] = useState(false);

  const quickFilters = [
    {
      label: "Hoje",
      onClick: () => {
        const today = new Date();
        const range = { from: startOfDay(today), to: endOfDay(today) };
        setDateRange(range);
      }
    },
    {
      label: "Ontem",
      onClick: () => {
        const yesterday = subDays(new Date(), 1);
        const range = { from: startOfDay(yesterday), to: endOfDay(yesterday) };
        setDateRange(range);
      }
    },
    {
      label: "Últimos 7 dias",
      onClick: () => {
        const today = new Date();
        const sevenDaysAgo = subDays(today, 6);
        const range = { from: startOfDay(sevenDaysAgo), to: endOfDay(today) };
        setDateRange(range);
      }
    },
    {
      label: "Últimos 30 dias",
      onClick: () => {
        const today = new Date();
        const thirtyDaysAgo = subDays(today, 29);
        const range = { from: startOfDay(thirtyDaysAgo), to: endOfDay(today) };
        setDateRange(range);
      }
    },
    {
      label: "Este mês",
      onClick: () => {
        const today = new Date();
        const range = { from: startOfMonth(today), to: endOfMonth(today) };
        setDateRange(range);
      }
    }
  ];

  const handleApply = () => {
    onDateRangeChange(dateRange.from || null, dateRange.to || null);
    setOpen(false);
  };

  const handleClear = () => {
    setDateRange({ from: undefined, to: undefined });
    onDateRangeChange(null, null);
  };

  const formatDateRange = () => {
    if (!dateRange.from) return "Período";
    if (!dateRange.to) return format(dateRange.from, "dd/MM/yyyy");
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, "dd/MM/yyyy")} - ${format(dateRange.to, "dd/MM/yyyy")}`;
    }
    return "Período";
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-12 px-6 rounded-2xl border-0 bg-white shadow-lg ring-1 ring-gray-200/60 justify-start text-left"
        >
          <CalendarIcon className="w-4 h-4 mr-2" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white border shadow-lg" align="start">
        <div className="p-4">
          <div className="space-y-3 mb-4">
            <h4 className="font-medium text-sm text-gray-900">Filtros Rápidos</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickFilters.map((filter, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={filter.onClick}
                  className="text-xs"
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="font-medium text-sm text-gray-900 mb-3">Período Personalizado</h4>
            <CalendarComponent
              mode="range"
              selected={dateRange}
              onSelect={(range) => {
                if (range) {
                  setDateRange({ from: range.from, to: range.to });
                } else {
                  setDateRange({ from: undefined, to: undefined });
                }
              }}
              numberOfMonths={1}
              className="pointer-events-auto"
            />
          </div>
          
          <div className="flex items-center justify-between pt-4 border-t mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="text-gray-600"
            >
              Limpar
            </Button>
            <Button
              onClick={handleApply}
              size="sm"
              className="bg-primary"
              disabled={!dateRange.from}
            >
              Aplicar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
