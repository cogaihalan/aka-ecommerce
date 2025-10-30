import { DataTableWrapper } from "@/components/ui/table/data-table-wrapper";
import { searchParamsCache } from "@/lib/searchparams";
import { storefrontServerSubmissionService } from "@/lib/api/services/storefront/extensions/submissions/submissions";
import type { Submission } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { SubmissionDialog } from "./submission-dialog";

const columns = [
    {id:"images", header: "Ảnh", accessorKey: "photos",
    cell: ({ row }: any) => {
      const s = row.original as Submission;
      return (
        <div>
          <Image src={s.photos[0].url} alt={s.name} width={100} height={100} />
        </div>
      );
    },
  },
  {
    id: "name",
    header: "Bài dự thi",
    cell: ({ row }: any) => {
      const s = row.original as Submission;
      return (
        <div>
          <div className="font-medium">{s.name}</div>
          <div className="text-xs text-muted-foreground">{s.barberName}</div>
        </div>
      );
    },
  },
  { id: "voteCount", header: "Bình chọn", accessorKey: "voteCount",
    cell: ({ row }: any) => {
      const s = row.original as Submission;
      return (
        <div>
          <span>{s.voteCount}</span>
        </div>
      );
    },
  },
  { id: "status", header: "Trạng thái", accessorKey: "status",
    cell: ({ row }: any) => {
      const s = row.original as Submission;
      return (
        <div>
          <Badge variant={s.status === "APPROVED" ? "default" : "secondary"}>{s.status}</Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Hành động",
    cell: ({ row }: any) => {
      const s = row.original as Submission;
      return (
        <div className="flex gap-2">
          <SubmissionDialog submission={s}>
            <Button variant="ghost" size="sm">Sửa</Button>
          </SubmissionDialog>
        </div>
      );
    },
  }
] as any;

export default async function MySubmissionsPage() {
  const page = searchParamsCache.get("page");
  const pageLimit = searchParamsCache.get("perPage");
  const sort = searchParamsCache.get("sort");
  const status = searchParamsCache.get("status");

  const query = {
    page: page ? parseInt(page.toString()) : 1,
    size: pageLimit ? parseInt(pageLimit.toString()) : 10,
    sort: sort
      ? Array.isArray(sort)
        ? [`${sort[0]?.id},${sort[0]?.desc ? "desc" : "asc"}`]
        : [`${(sort as any).id},${(sort as any).desc ? "desc" : "asc"}`]
      : undefined,
    status: status?.toString(),
  } as any;

  const data = await storefrontServerSubmissionService.getSubmissions(query);
  const total = data.pagination?.total || data.items?.length || 0;
  const submissions = data.items || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Bài dự thi</h1>
          <p className="text-muted-foreground">Quản lý bài dự thi cá nhân ({total} tổng)</p>
        </div>
        <SubmissionDialog>
          <Button>Thêm bài dự thi</Button>
        </SubmissionDialog>
      </div>

      {submissions.length > 0 ? (
        <DataTableWrapper
          data={submissions}
          totalItems={total}
          columns={columns}
          debounceMs={500}
          shallow={false}
          position="relative"
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Không tìm thấy bài dự thi</p>
        </div>
      )}
    </div>
  );
}


