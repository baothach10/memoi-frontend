import Pagination from "@mui/material/Pagination";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

type PaginationComponentType = {
    totalPage: number;
    page: number;
    onChange?: (page: number) => void;
};

export default function PaginationComponent({
    totalPage,
    page,
    onChange,
}: PaginationComponentType) {
    return (
        <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            className=" w-full px-2.5 smaller-tablet:max-tablet:px-10 max-mobile:px-5"
        >
            {/* ⬅️ PREVIOUS */}
            <IconButton
                onClick={() => onChange?.(page - 1)}
                disabled={page === 1}
                sx={{
                    color: "black",
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    width: 40,
                    height: 40,
                }}
            >
                <ArrowBack />
            </IconButton>

            {/* 🔢 NUMBERS (GROUPED) */}
            <Pagination
                count={totalPage}
                page={page}
                onChange={(_, p) => onChange?.(p)}
                hidePrevButton
                hideNextButton
                shape="rounded"
            />

            {/* ➡️ NEXT */}
            <IconButton
                onClick={() => onChange?.(page + 1)}
                disabled={page === totalPage}
                sx={{
                    color: "black",
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 1,
                    width: 40,
                    height: 40,
                }}
            >
                <ArrowForward />
            </IconButton>
        </Stack>
    );
}
