"use client";

import React, { useState } from "react";
import { HabitFormValues, habitFormSchema } from "../schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const PRESET_COLORS = [
  { name: "Emerald", hex: "#10b981" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Violet", hex: "#8b5cf6" },
  { name: "Amber", hex: "#f59e0b" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Cyan", hex: "#06b6d4" },
];

const DAYS_OF_WEEK = [
  { label: "Mon", value: 1 },
  { label: "Tue", value: 2 },
  { label: "Wed", value: 3 },
  { label: "Thu", value: 4 },
  { label: "Fri", value: 5 },
  { label: "Sat", value: 6 },
  { label: "Sun", value: 0 },
];

interface HabitFormProps {
  initialValues?: Partial<HabitFormValues>;
  onSubmit: (values: HabitFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function HabitForm({
  initialValues,
  onSubmit,
  onCancel,
  isSubmitting = false,
  submitLabel = "Save Habit",
}: HabitFormProps) {
  const [name, setName] = useState(initialValues?.name || "");
  const [description, setDescription] = useState(initialValues?.description || "");
  const [frequency, setFrequency] = useState<"DAILY" | "WEEKLY">(
    initialValues?.frequency || "DAILY"
  );
  const [scheduledDays, setScheduledDays] = useState<number[]>(
    initialValues?.scheduledDays || [0, 1, 2, 3, 4, 5, 6]
  );
  const [color, setColor] = useState(initialValues?.color || "#3b82f6");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const toggleDay = (dayValue: number) => {
    if (frequency === "DAILY") return;
    setScheduledDays((prev) => {
      if (prev.includes(dayValue)) {
        if (prev.length <= 1) return prev; // Keep at least one
        return prev.filter((d) => d !== dayValue);
      } else {
        return [...prev, dayValue].sort((a, b) => a - b);
      }
    });
  };

  const handleFrequencyChange = (newFreq: "DAILY" | "WEEKLY") => {
    setFrequency(newFreq);
    if (newFreq === "DAILY") {
      setScheduledDays([0, 1, 2, 3, 4, 5, 6]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = {
      name,
      description: description || null,
      frequency,
      scheduledDays,
      color,
    };

    const result = habitFormSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0]?.toString() || "form";
        fieldErrors[fieldName] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Habit Name Field */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="habit-name">Habit Name *</Label>
          <span className="text-[11px] text-muted-foreground">{name.length}/100</span>
        </div>
        <Input
          id="habit-name"
          placeholder="e.g., Read 15 pages of book"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={100}
          className={cn(errors.name && "border-destructive focus-visible:ring-destructive/30")}
        />
        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="habit-desc">Description (Optional)</Label>
          <span className="text-[11px] text-muted-foreground">{description.length}/500</span>
        </div>
        <Input
          id="habit-desc"
          placeholder="e.g., Every morning after brewing coffee"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          className={cn(errors.description && "border-destructive focus-visible:ring-destructive/30")}
        />
        {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
      </div>

      {/* Frequency Toggle */}
      <div className="space-y-2">
        <Label>Frequency</Label>
        <div className="grid grid-cols-2 gap-2 max-w-xs">
          <Button
            type="button"
            variant={frequency === "DAILY" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFrequencyChange("DAILY")}
          >
            Daily
          </Button>
          <Button
            type="button"
            variant={frequency === "WEEKLY" ? "default" : "outline"}
            size="sm"
            onClick={() => handleFrequencyChange("WEEKLY")}
          >
            Specific Days
          </Button>
        </div>
      </div>

      {/* Scheduled Days Selection */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label>Scheduled Days</Label>
          {frequency === "DAILY" && (
            <span className="text-xs text-muted-foreground">Every day</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {DAYS_OF_WEEK.map((d) => {
            const isSelected = scheduledDays.includes(d.value);
            return (
              <button
                key={d.value}
                type="button"
                disabled={frequency === "DAILY"}
                onClick={() => toggleDay(d.value)}
                className={cn(
                  "size-10 rounded-lg text-xs font-semibold transition-all border",
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-secondary/40 text-muted-foreground border-border hover:bg-secondary",
                  frequency === "DAILY" && "opacity-90 cursor-default"
                )}
              >
                {d.label}
              </button>
            );
          })}
        </div>
        {errors.scheduledDays && (
          <p className="text-xs text-destructive">{errors.scheduledDays}</p>
        )}
      </div>

      {/* Preset Colors */}
      <div className="space-y-2">
        <Label>Accent Color</Label>
        <div className="flex items-center gap-3 pt-1">
          {PRESET_COLORS.map((preset) => {
            const isSelected = color === preset.hex;
            return (
              <button
                key={preset.hex}
                type="button"
                onClick={() => setColor(preset.hex)}
                style={{ backgroundColor: preset.hex }}
                className={cn(
                  "size-8 rounded-full flex items-center justify-center text-white transition-transform hover:scale-110",
                  isSelected && "ring-2 ring-offset-2 ring-primary scale-110"
                )}
                title={preset.name}
              >
                {isSelected && <Check className="size-4 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
