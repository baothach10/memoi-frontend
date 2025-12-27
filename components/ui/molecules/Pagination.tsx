import Pagination from "@mui/material/Pagination";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import { ArrowBack, ArrowForward, ChevronLeft, ChevronRight } from "@mui/icons-material";

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
            className=" w-full px-[100px] smaller-tablet:max-tablet:px-10 max-mobile:px-5"
        >
            {/* ⬅️ PREVIOUS */}
            <IconButton
                onClick={() => onChange?.(page - 1)}
                disabled={page === 1}
                sx={{
                    color: "black",
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 0,
                    width: 40,
                    height: 40,
                }}
            >
                <ChevronLeft />
            </IconButton>

            {/* 🔢 NUMBERS (GROUPED) */}
            <Pagination
                count={totalPage}
                page={page}
                onChange={(_, p) => onChange?.(p)}
                hidePrevButton
                hideNextButton
                sx={{
                    '& .MuiPaginationItem-root': {
                        borderRadius: 0,
                    },

                    '& .MuiPaginationItem-root.Mui-selected': {
                        backgroundColor: 'rgba(0, 0, 0, 0.1)', // 20%
                        color: '#000',

                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.1)', // 10%
                        },
                    },
                }}

            />

            {/* ➡️ NEXT */}
            <IconButton
                onClick={() => onChange?.(page + 1)}
                disabled={page === totalPage}
                sx={{
                    color: "black",
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 0,
                    width: 40,
                    height: 40,
                }}
            >
                <ChevronRight />
            </IconButton>
        </Stack>
    );
}
