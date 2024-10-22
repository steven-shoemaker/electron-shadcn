import React from 'react';
import { ColumnDef } from "@tanstack/react-table";
import { Employee } from "../lib/interfaces/Employee";
import { DataTableColumnHeader } from "./DataTableColumnHeader";

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
  },
  {
    accessorKey: "age",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Age" />,
  },
  {
    accessorKey: "gender",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Gender" />,
  },
  {
    accessorKey: "ethnicity",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ethnicity" />,
  },
  {
    accessorKey: "department",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Department" />,
  },
  {
    accessorKey: "hireDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Hire Date" />,
    cell: ({ row }) => new Date(row.getValue("hireDate")).toLocaleDateString(),
  },
  {
    accessorKey: "terminationDate",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Termination Date" />,
    cell: ({ row }) => {
      const date = row.getValue("terminationDate");
      return date ? new Date(date as string).toLocaleDateString() : 'N/A';
    },
  },
  {
    accessorKey: "promotionDates",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Promotions" />,
    cell: ({ row }) => (row.getValue("promotionDates") as string[]).length,
  },
];
