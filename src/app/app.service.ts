import { Injectable } from '@angular/core';

export class List {
    id: number;
    text: string;
    links:any[]=[];
}

let navigation: List[] = [
    // { id: 1, text: "Ontology" },
    // { id: 2, text: "SME" }
    {
        id:1,
        text:'Setup',
        links:[{
            text:'Admin dashboard',
            link:'/admin'
        },{
            text:'Users and Roles',
            link:'/users'
        },{
            text:'I/O sources',
            link:'/input-source'
        },
        // {
        //     text:'OCR engines',
        //     link:'/OCR'
        // },
        {
            text:'Queues',
            link:'/queues'
        },{
            text:'SMTP settings',
            link:'/smtp'
        },{
            text:'Application settings',
            link:'/appsetting'
        }]
    },
    {
        id:2,
        text:'Create',
        links:[{
            text:'Creator dashboard',
            link:'/dashboard'
        }]
    },
    {
        id:3,
        text:'Execute',
        links:[
            {
            text:'Manual intervantions',
            link:'/manualhandling'
        },
        {
            text:'Quality check',
            link:'/qualitycheck'
        },
       
    ]
    },
    {
        id:4,
        text:'Analyse',
        links:[{
            text:'Operations dashboard',
            link:'/operational-manager'
        },{
            text:'Allocation',
            link:'/user-allocation'
        },
        {
            text:'Document Monitor',
            link:'/Document-Monitor'
        },
        {
            text:'Audit',
            link:'/audit'
        },
        
        // {
        //     text:'Document monitor',
        //     link:'/document-monitor'
        // }
        // ,
        {
            text:'User productivity',
            link:'/user-load-productivity'
        }
        //,{
        //     text:'Audit',
        //     link:'/audit'
        // },{
        //     text:'Alerts',
        //     link:'/alerts'
        // }
    ]
    }
];

@Injectable()
export class Service {
    getNavigationList(): List[] {
        return navigation;
    }
}
